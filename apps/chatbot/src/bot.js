import { cleanup, loadConvHistory, saveConvHistory, getHistory, addToHistory, getConvState, setFormData, getFormData, setAwaitingImages, addReceivedImage, clearImagesState, setAwaitingAppointment, addAppointmentSlot, checkAwaitingAppointment, clearAppointmentState, setAwaitingCancelConfirmation, getAwaitingCancelConfirmation, clearCancelConfirmation, setAwaitingRescheduleDate, getAwaitingRescheduleDate, clearRescheduleDate, setExtraction, getExtraction, setAwaitingAfiliado, clearAwaitingAfiliado } from './state.js';
import { detectUrgency, detectarIntencion } from './intent.js';
import { getUrgentResponse, SITE_URL } from './knowledge.js';
import { buildPrompt, buildReply, getPromptText } from './prompt.js';
import { callGemini, getCachedReply, setCachedReply } from './ai.js';
import { getSectionForIntent, findService, getFormLink, detectFields } from './knowledge-data.js';
import { missingPhotos, missingNumbers, buildRequirementsMessage } from './requirements.js';
import { mergeExtractedData, inferDocumentType } from './images.js';
import { checkAvailability, createAppointment, sendToCRM, getAppointmentsByClient, cancelAppointment, rescheduleAppointment, createOrUpdateClient, notifyBackoffice } from './crm.js';
import { extractData } from './extract.js';

function getRDHour() {
  const now = new Date();
  const utcHour = now.getUTCHours();
  const rdHour = (utcHour - 4 + 24) % 24;
  return rdHour;
}

function getMockResponse(text, greeting, from, history) {
  const t = text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const servicioCode = findService(text);
  const formLink = getFormLink(servicioCode, from);
  if (t.includes('precio') || t.includes('cuanto cuesta') || t.includes('costo') || t.includes('cotiz') || t.includes('cuanto')) {
    return `Con gusto le ayudamos con la cotización. Tiene 2 opciones:\n1) Llenar el formulario web (más rápido): ${formLink}\n2) Le tomo los datos por aquí (manual/asistido) y un asesor lo contacta.\n¿Qué opción prefiere?\nESCALACION:cotización`;
  }
  if (t.includes('gracias')) {
    return `De nada. Quedamos atentos.`;
  }
  if (t.includes('agendar') || t.includes('cita') || t.includes('visita') || t.includes('domicilio')) {
    return `Claro. Tiene 2 opciones:\n1) Llenar el formulario web (más rápido): ${formLink}\n2) Le tomo los datos por aquí (manual/asistido) y un asesor lo contacta.\n¿Cómo prefiere?`;
  }
  if (t.includes('seguro') || t.includes('ars')) {
    return `Tenemos convenio con Bupa, La Colonial, Meta Salud, APS, Monumental y Aetna. Para otros emitimos carta de reembolso. ¿Cuál es su seguro?`;
  }
  if (t.includes('horario') || t.includes('hora')) {
    return `Lun-vie 8:00am-6:00pm. Sáb disponibilidad limitada. Domingos no.`;
  }
  if (t.includes('zona') || t.includes('cobertura') || t.includes('cubren') || t.includes('ubicaci')) {
    return `Cubrimos Santo Domingo, Nagua, Terrenas, Santiago y zonas aledañas. ¿Su dirección?`;
  }
  if (t.includes('hola') || t.includes('bueno') || t.includes('saludos')) {
    return `Bienvenido a UNIDOLOR. ¿En qué puedo ayudarle?`;
  }
  return `¿En qué puedo ayudarle?`;
}

export function createBot(env) {
  async function handleMessage(from, text) {
    const kv = env.SEGUIMIENTO;
    await loadConvHistory(from, kv);
    cleanup();

    const hour = getRDHour();
    const greeting = hour < 12 ? 'Buenos días' : hour < 18 ? 'Buenas tardes' : 'Buenas noches';

    if (detectUrgency(text)) {
      const reply = getUrgentResponse();
      addToHistory(from, 'user', text);
      addToHistory(from, 'assistant', reply);
      await saveConvHistory(from, kv);
      return { reply, type: 'urgent', requiresEscalation: true };
    }

    const appointmentKeywords = /agendar(?:\s+una)?\s+cita|quiero\s+(?:una\s+)?cita|necesito\s+(?:una\s+)?cita|programar(?:\s+una)?\s+cita|cita\s+con|cita\s+para|reservar(?:\s+una)?\s+cita/;

    const currentState = getConvState(from);
    const hasAppointmentIntent = appointmentKeywords.test(text);
    // No usar cache cuando hay un flujo interactivo activo (fotos/números/citas):
    // de lo contrario una respuesta cacheada ("Falta enviar foto...") se devuelve
    // para siempre sin procesar el estado ni los timeouts.
    const skipCache = currentState.awaitingAppointment || currentState.awaitingImages || currentState.awaitingAfiliado || currentState.awaitingCancelConfirmation || currentState.awaitingRescheduleDate || hasAppointmentIntent;

    if (!skipCache) {
      const cached = await getCachedReply(text, kv);
      if (cached) {
        addToHistory(from, 'user', text);
        addToHistory(from, 'assistant', cached);
        await saveConvHistory(from, kv);
        return { reply: cached, type: 'cache' };
      }
    }

    const history = getHistory(from);
    const intent = detectarIntencion(text, history);
    const knowledgeSection = getSectionForIntent(intent, text);
    const userTexts = [...history.filter(h => h.role === 'user').map(h => h.content), text];
    const fields = detectFields(userTexts);
    const state = getConvState(from);
    const isTest = env.TEST_MODE === '1' || env.TEST_MODE === true;

    // ── Flujo de citas: se maneja ANTES del LLM para que funcione aunque la IA falle ──

    // Appointment timeout
    if (state.awaitingAppointment && state.appointmentTimeoutAt && Date.now() > state.appointmentTimeoutAt) {
      clearAppointmentState(from);
      const msg = 'Tiempo agotado para agendar. Puede intentarlo de nuevo cuando quiera.';
      addToHistory(from, 'user', text);
      addToHistory(from, 'assistant', msg);
      if (!isTest) await setCachedReply(text, msg, kv);
      await saveConvHistory(from, kv);
      return { reply: msg, type: 'appointment_timeout' };
    }

    // Handle awaiting appointment date
    if (state.awaitingAppointment?.awaitingDate) {
      const dateMatch = text.match(/(\d{1,2})[\/\-](\d{1,2})(?:[\/\-](\d{2,4}))?/);
      if (dateMatch) {
        const day = parseInt(dateMatch[1]);
        const month = parseInt(dateMatch[2]);
        const year = dateMatch[3] ? parseInt(dateMatch[3]) : new Date().getFullYear();
        const fullYear = year < 100 ? 2000 + year : year;
        const selectedDate = `${fullYear}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;

        // Validate date is not in the past
        const selected = new Date(selectedDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (selected < today) {
          const msg = 'La fecha no puede ser en el pasado. Por favor indique una fecha futura (ej: 20/08 o 20/08/2026).';
          addToHistory(from, 'user', text);
          addToHistory(from, 'assistant', msg);
          if (!isTest) await setCachedReply(text, msg, kv);
          await saveConvHistory(from, kv);
          return { reply: msg, type: 'awaiting_appointment_date' };
        }

        // Check availability for that date
        const formData = getFormData(from);
        const serviceCode = findService(formData.servicio || '') || state.awaitingAppointment.serviceCode;
        const tipoCita = state.awaitingAppointment.tipoCita || 'primera_vez';

        let avail;
        try {
          avail = await checkAvailability(env, {
            from: selectedDate,
            to: selectedDate,
            type: tipoCita,
            limit: 20,
          });
        } catch (err) {
          console.error('Availability check error:', err);
          const msg = 'Hubo un error consultando disponibilidad. Intente de nuevo.';
          addToHistory(from, 'user', text);
          addToHistory(from, 'assistant', msg);
          if (!isTest) await setCachedReply(text, msg, kv);
          await saveConvHistory(from, kv);
          return { reply: msg, type: 'error' };
        }

        if (avail.success && avail.result && avail.result.length > 0) {
          // Filter for Dra. Bethania first (priority)
          const bethaniaSlots = avail.result.filter(s => s.doctor?.name?.toLowerCase().includes('bethania'));
          const otherSlots = avail.result.filter(s => !s.doctor?.name?.toLowerCase().includes('bethania'));
          const sortedSlots = [...bethaniaSlots, ...otherSlots].slice(0, 10);

          if (sortedSlots.length > 0) {
            setAwaitingAppointment(from, {
              ...state.awaitingAppointment,
              awaitingDate: false,
              awaitingSlot: true,
              selectedDate,
              availableSlots: sortedSlots,
            });

            let msg = `Disponible para el ${day}/${month}:`;
            sortedSlots.forEach((slot, i) => {
              const doctorName = slot.doctor?.name || 'Doctor';
              msg += `\n${i + 1}. ${slot.start} - ${slot.end} (${doctorName})`;
            });
            msg += '\n\nResponda con el número de su preferencia.';

            addToHistory(from, 'user', text);
            addToHistory(from, 'assistant', msg);
            if (!isTest) await setCachedReply(text, msg, kv);
            await saveConvHistory(from, kv);
            return { reply: msg, type: 'awaiting_appointment_slot' };
          } else {
            const msg = `No hay disponibilidad para el ${day}/${month}. ¿Quiere probar con otra fecha?`;
            addToHistory(from, 'user', text);
            addToHistory(from, 'assistant', msg);
            if (!isTest) await setCachedReply(text, msg, kv);
            await saveConvHistory(from, kv);
            return { reply: msg, type: 'awaiting_appointment_date' };
          }
        } else {
          const msg = `No hay disponibilidad para el ${day}/${month}. ¿Quiere probar con otra fecha?`;
          addToHistory(from, 'user', text);
          addToHistory(from, 'assistant', msg);
          if (!isTest) await setCachedReply(text, msg, kv);
          await saveConvHistory(from, kv);
          return { reply: msg, type: 'awaiting_appointment_date' };
        }
      } else {
          const msg = 'Por favor indique la fecha (ej: 20/08 o 20/08/2026).';
          addToHistory(from, 'user', text);
          addToHistory(from, 'assistant', msg);
          if (!isTest) await setCachedReply(text, msg, kv);
          await saveConvHistory(from, kv);
          return { reply: msg, type: 'awaiting_appointment_date' };
        }
      }

    // Handle awaiting appointment slot selection
    if (state.awaitingAppointment?.awaitingSlot) {
      const slotNum = parseInt(text.trim());
      const slots = state.awaitingAppointment.availableSlots || [];
      if (!isNaN(slotNum) && slotNum >= 1 && slotNum <= slots.length) {
        const selectedSlot = slots[slotNum - 1];

        // Create appointment
        let formData = getFormData(from);

        // Si formData se perdió (KV eventual consistency), reconstruir desde el historial
        if (!formData.nombre || !formData.telefono) {
          const userTexts = getHistory(from).filter(h => h.role === 'user').map(h => h.content);
          const rebuilt = detectFields([...userTexts, text]);
          if (rebuilt.nombre && rebuilt.telefono) {
            formData = { ...formData, ...rebuilt };
            setFormData(from, formData);
          }
        }

        // Validación anti-pruebas: orígenes de prueba y números ficticios no crean citas reales
        const esOrigenPrueba = from === 'chat-web' || (env.ESCALATION_PHONE_NUMBER && from === env.ESCALATION_PHONE_NUMBER);
        const telPaciente = (formData.telefono || '').replace(/\D/g, '');
        const telFicticio = telPaciente.length >= 10 && (telPaciente.slice(3, 6) === '555' || /5555/.test(telPaciente));
        if (esOrigenPrueba || telFicticio) {
          clearAppointmentState(from);
          const motivo = esOrigenPrueba ? 'origen de prueba' : 'teléfono no válido';
          const msg = 'No se pudo registrar la cita en el sistema (' + motivo + '). Por favor intente desde WhatsApp con un número de contacto válido.';
          addToHistory(from, 'user', text);
          addToHistory(from, 'assistant', msg);
          if (!isTest) await setCachedReply(text, msg, kv);
          await saveConvHistory(from, kv);
          return { reply: msg, type: 'test_no_crm' };
        }

        let crmData = state.awaitingAppointment.crmData || {};

        // Si es reprogramación, no necesita sincronizar cliente ni crear nueva cita
        if (state.awaitingAppointment.isReschedule) {
          const appointmentId = state.awaitingAppointment.rescheduleAppointmentId;
          try {
            const result = await rescheduleAppointment(env, appointmentId, {
              date: selectedSlot.date,
              startTime: selectedSlot.start,
              endTime: selectedSlot.end,
            });
            if (result.success) {
              clearAppointmentState(from);
              clearRescheduleDate(from);
              const msg = `✅ Cita reprogramada correctamente:\n📅 ${selectedSlot.date}\n⏰ ${selectedSlot.start} - ${selectedSlot.end}\n👨‍⚕️ ${selectedSlot.doctor.name}\n🏥 ${selectedSlot.branch.name}\n\nUn recordatorio se enviará antes de su cita.`;
              addToHistory(from, 'user', text);
              addToHistory(from, 'assistant', msg);
              if (!isTest) await setCachedReply(text, msg, kv);
              await saveConvHistory(from, kv);
              return { reply: msg, type: 'appointment_rescheduled', requiresEscalation: false };
            } else {
              const msg = 'No se pudo reprogramar la cita. Intente con otro horario.';
              addToHistory(from, 'user', text);
              addToHistory(from, 'assistant', msg);
              if (!isTest) await setCachedReply(text, msg, kv);
              await saveConvHistory(from, kv);
              return { reply: msg, type: 'awaiting_reschedule_slot' };
            }
          } catch (err) {
            console.error('Reschedule appointment error:', err);
            const msg = 'Hubo un error reprogramando la cita. Intente de nuevo.';
            addToHistory(from, 'user', text);
            addToHistory(from, 'assistant', msg);
            if (!isTest) await setCachedReply(text, msg, kv);
            await saveConvHistory(from, kv);
            return { reply: msg, type: 'error' };
          }
        }

        // Si no hay contactId aún, sincronizar el cliente al CRM primero
        if (!crmData.contactId && formData.nombre && formData.telefono) {
          const sync = await sendToCRM(env, {
            nombre: formData.nombre,
            first_name: formData.first_name || '',
            last_name: formData.last_name || '',
            telefono: formData.telefono,
            direccion: formData.direccion || '',
            servicio: formData.servicio || '',
            cedula: formData.cedula || '',
            seguro: formData.seguro || '',
            afiliado: formData.afiliado || '',
            email: formData.email || '',
            fecha_nacimiento: formData.fecha_nacimiento || '',
            genero: formData.genero || '',
            sucursal: formData.sucursal || '',
            notas: formData.notas || '',
            requisitos: formData.requisitos || {},
            // Quién agenda vs paciente (agendar para otra persona)
            caller_phone: from,
            caller_name: formData.caller_name || '',
            relationship: formData.relationship || 'mismo',
            patient_name: formData.patient_name || '',
            patient_phone: formData.patient_phone || formData.telefono || '',
            source_channel: 'whatsapp',
            tipoCita: state.awaitingAppointment.tipoCita || 'primera_vez',
            fuente: 'whatsapp',
          });
          if (sync.ok) {
            crmData = { contactId: sync.contactId, opportunityId: sync.opportunityId };
            setFormData(from, { contactId: sync.contactId, opportunityId: sync.opportunityId });
            setAwaitingAppointment(from, { crmData });
          } else {
            console.error('CRM sync failed before appointment:', sync.error);
            const msg = 'No se pudo crear la cita. Intente con otro horario.';
            addToHistory(from, 'user', text);
            addToHistory(from, 'assistant', msg);
            if (!isTest) await setCachedReply(text, msg, kv);
            await saveConvHistory(from, kv);
            return { reply: msg, type: 'awaiting_appointment_slot' };
          }
        }

        if (!crmData.contactId) {
          const msg = 'No se pudo crear la cita: faltan datos del paciente.';
          addToHistory(from, 'user', text);
          addToHistory(from, 'assistant', msg);
          if (!isTest) await setCachedReply(text, msg, kv);
          await saveConvHistory(from, kv);
          return { reply: msg, type: 'error' };
        }

        try {
          const appointment = await createAppointment(env, {
            client: crmData.contactId,
            doctor: selectedSlot.doctor._id,
            branch: selectedSlot.branch._id,
            date: selectedSlot.date,
            startTime: selectedSlot.start,
            endTime: selectedSlot.end,
            type: state.awaitingAppointment.tipoCita || 'primera_vez',
            notes: formData.notas || '',
            opportunity: crmData.opportunityId,
            serviceName: formData.servicioLabel || formData.servicio || '',
          });

          if (appointment.success) {
            clearAppointmentState(from);

            // Consolidar toda la data del paciente y notificar al back-office (cliente + cita)
            let allData = {
              ...formData,
              nombre: formData.nombre || formData.patient_name || '',
              telefono: formData.telefono || (formData.patient_phone || '') || from,
              cedula: formData.cedula || '',
              servicio: formData.servicio || '',
              servicioLabel: formData.servicioLabel || '',
              seguro: formData.seguro || '',
            };
            try {
              await notifyBackoffice(env, allData, crmData, {
                success: true,
                date: selectedSlot.date,
                startTime: selectedSlot.start,
                endTime: selectedSlot.end,
                doctorName: selectedSlot.doctor?.name || '',
                branchName: selectedSlot.branch?.name || '',
                appointmentId: appointment.appointmentId || appointment.id || appointment._id || '',
              });
            } catch (e) {
              console.error('Backoffice notify error after appointment:', e.message);
            }

            const msg = `✅ Cita confirmada:\n📅 ${selectedSlot.date}\n⏰ ${selectedSlot.start} - ${selectedSlot.end}\n👨‍⚕️ ${selectedSlot.doctor.name}\n🏥 ${selectedSlot.branch.name}\n\nUn recordatorio se enviará antes de su cita.`;

            addToHistory(from, 'user', text);
            addToHistory(from, 'assistant', msg);
            if (!isTest) await setCachedReply(text, msg, kv);
            await saveConvHistory(from, kv);
            return { reply: msg, type: 'appointment_confirmed', requiresEscalation: false };
          } else {
            const msg = 'No se pudo crear la cita. Intente con otro horario.';
            addToHistory(from, 'user', text);
            addToHistory(from, 'assistant', msg);
            if (!isTest) await setCachedReply(text, msg, kv);
            await saveConvHistory(from, kv);
            return { reply: msg, type: 'awaiting_appointment_slot' };
          }
        } catch (err) {
          console.error('Create appointment error:', err);
          const msg = 'Hubo un error creando la cita. Intente de nuevo.';
          addToHistory(from, 'user', text);
          addToHistory(from, 'assistant', msg);
          if (!isTest) await setCachedReply(text, msg, kv);
          await saveConvHistory(from, kv);
          return { reply: msg, type: 'error' };
        }
      } else {
        const msg = `Por favor responda con un número del 1 al ${slots.length}.`;
        addToHistory(from, 'user', text);
        addToHistory(from, 'assistant', msg);
        if (!isTest) await setCachedReply(text, msg, kv);
        await saveConvHistory(from, kv);
        return { reply: msg, type: 'awaiting_appointment_slot' };
      }
    }

    // ── Cancelación / Reprogramación de citas ──

    // Handle awaiting cancel confirmation (user has selected an appointment and is confirming)
    if (state.awaitingCancelConfirmation?.appointmentId) {
      const { appointmentId, appointmentDetails } = state.awaitingCancelConfirmation;
      const confirmText = text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

      if (confirmText.includes('sí') || confirmText.includes('si') || confirmText.includes('cancelar') || confirmText.includes('s')) {
        try {
          const result = await cancelAppointment(env, appointmentId);
          if (result.success) {
            // Clean up follow-ups for this phone
            await cleanupFollowUps(kv, from);
            clearCancelConfirmation(from);
            const msg = `✅ Cita cancelada correctamente.\n📅 ${appointmentDetails.date} ${appointmentDetails.startTime} - ${appointmentDetails.endTime}\n👨‍⚕️ ${appointmentDetails.doctorName}\n\nSi necesita reprogramar, con gusto le ayudamos.`;
            addToHistory(from, 'user', text);
            addToHistory(from, 'assistant', msg);
            if (!isTest) await setCachedReply(text, msg, kv);
            await saveConvHistory(from, kv);
            return { reply: msg, type: 'appointment_cancelled' };
          } else {
            const msg = 'No se pudo cancelar la cita. Intente de nuevo o contacte a un asesor.';
            addToHistory(from, 'user', text);
            addToHistory(from, 'assistant', msg);
            if (!isTest) await setCachedReply(text, msg, kv);
            await saveConvHistory(from, kv);
            return { reply: msg, type: 'error' };
          }
        } catch (err) {
          console.error('Cancel appointment error:', err);
          const msg = 'Hubo un error cancelando la cita. Intente de nuevo.';
          addToHistory(from, 'user', text);
          addToHistory(from, 'assistant', msg);
          if (!isTest) await setCachedReply(text, msg, kv);
          await saveConvHistory(from, kv);
          return { reply: msg, type: 'error' };
        }
      } else {
        clearCancelConfirmation(from);
        const msg = 'Cancelación omitida. ¿En qué más puedo ayudarle?';
        addToHistory(from, 'user', text);
        addToHistory(from, 'assistant', msg);
        if (!isTest) await setCachedReply(text, msg, kv);
        await saveConvHistory(from, kv);
        return { reply: msg, type: 'cancel_declined' };
      }
    }

    // Handle awaiting reschedule date
    if (state.awaitingRescheduleDate) {
      const { appointmentId } = state.awaitingRescheduleDate;
      const dateMatch = text.match(/(\d{1,2})[\/\-](\d{1,2})(?:[\/\-](\d{2,4}))?/);
      if (dateMatch) {
        const day = parseInt(dateMatch[1]);
        const month = parseInt(dateMatch[2]);
        const year = dateMatch[3] ? parseInt(dateMatch[3]) : new Date().getFullYear();
        const fullYear = year < 100 ? 2000 + year : year;
        const selectedDate = `${fullYear}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;

        const selected = new Date(selectedDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (selected < today) {
          const msg = 'La fecha no puede ser en el pasado. Por favor indique una fecha futura (ej: 20/08 o 20/08/2026).';
          addToHistory(from, 'user', text);
          addToHistory(from, 'assistant', msg);
          if (!isTest) await setCachedReply(text, msg, kv);
          await saveConvHistory(from, kv);
          return { reply: msg, type: 'awaiting_reschedule_date' };
        }

        try {
          const avail = await checkAvailability(env, {
            from: selectedDate,
            to: selectedDate,
            type: 'primera_vez',
            limit: 20,
          });

          if (avail.success && avail.result && avail.result.length > 0) {
            const bethaniaSlots = avail.result.filter(s => s.doctor?.name?.toLowerCase().includes('bethania'));
            const otherSlots = avail.result.filter(s => !s.doctor?.name?.toLowerCase().includes('bethania'));
            const sortedSlots = [...bethaniaSlots, ...otherSlots].slice(0, 10);

            if (sortedSlots.length > 0) {
              setAwaitingAppointment(from, {
                ...state.awaitingAppointment,
                awaitingDate: false,
                awaitingSlot: true,
                selectedDate,
                availableSlots: sortedSlots,
                isReschedule: true,
                rescheduleAppointmentId: appointmentId,
              });

              let msg = `Disponible para el ${day}/${month}:`;
              sortedSlots.forEach((slot, i) => {
                const doctorName = slot.doctor?.name || 'Doctor';
                msg += `\n${i + 1}. ${slot.start} - ${slot.end} (${doctorName})`;
              });
              msg += '\n\nResponda con el número de su preferencia.';

              addToHistory(from, 'user', text);
              addToHistory(from, 'assistant', msg);
              if (!isTest) await setCachedReply(text, msg, kv);
              await saveConvHistory(from, kv);
              return { reply: msg, type: 'awaiting_reschedule_slot' };
            } else {
              const msg = `No hay disponibilidad para el ${day}/${month}. ¿Quiere probar con otra fecha?`;
              addToHistory(from, 'user', text);
              addToHistory(from, 'assistant', msg);
              if (!isTest) await setCachedReply(text, msg, kv);
              await saveConvHistory(from, kv);
              return { reply: msg, type: 'awaiting_reschedule_date' };
            }
          } else {
            const msg = `No hay disponibilidad para el ${day}/${month}. ¿Quiere probar con otra fecha?`;
            addToHistory(from, 'user', text);
            addToHistory(from, 'assistant', msg);
            if (!isTest) await setCachedReply(text, msg, kv);
            await saveConvHistory(from, kv);
            return { reply: msg, type: 'awaiting_reschedule_date' };
          }
        } catch (err) {
          console.error('Reschedule availability error:', err);
          const msg = 'Hubo un error consultando disponibilidad. Intente de nuevo.';
          addToHistory(from, 'user', text);
          addToHistory(from, 'assistant', msg);
          if (!isTest) await setCachedReply(text, msg, kv);
          await saveConvHistory(from, kv);
          return { reply: msg, type: 'error' };
        }
      } else {
        const msg = 'Por favor indique la fecha (ej: 20/08 o 20/08/2026).';
        addToHistory(from, 'user', text);
        addToHistory(from, 'assistant', msg);
        if (!isTest) await setCachedReply(text, msg, kv);
        await saveConvHistory(from, kv);
        return { reply: msg, type: 'awaiting_reschedule_date' };
      }
    }

    // Handle cancel/reprogram intent when NOT in appointment flow
    if ((intent === 'cancelacion' || intent === 'reembolso' || intent === 'reprogramacion') && !state.awaitingAppointment && !state.awaitingCancelConfirmation && !state.awaitingRescheduleDate) {
      const formData = getFormData(from);
      const phone = formData.telefono || fields.telefono || '';

      if (phone) {
        try {
          const result = await getAppointmentsByClient(env, phone);
          if (result.success && result.result && result.result.length > 0) {
            const activeApps = result.result.filter(a => a.status === 'programada' || a.status === 'pendiente');
            if (activeApps.length > 0) {
              let msg = 'Tiene las siguientes citas pendientes:\n';
              activeApps.forEach((appt, i) => {
                msg += `${i + 1}. ${appt.date} ${appt.startTime}-${appt.endTime} — ${appt.doctor?.name || 'Doctor'} (${appt.branch?.name || 'Sucursal'})\n`;
              });
              msg += '\n¿Desea cancelar o reprogramar alguna? Responda con el número.';

              // Store the appointments in state for reference
              setAwaitingCancelConfirmation(from, { appointments: activeApps });

              addToHistory(from, 'user', text);
              addToHistory(from, 'assistant', msg);
              if (!isTest) await setCachedReply(text, msg, kv);
              await saveConvHistory(from, kv);
              return { reply: msg, type: 'show_appointments' };
            } else {
              const msg = 'No tiene citas pendientes. ¿En qué más puedo ayudarle?';
              addToHistory(from, 'user', text);
              addToHistory(from, 'assistant', msg);
              if (!isTest) await setCachedReply(text, msg, kv);
              await saveConvHistory(from, kv);
              return { reply: msg, type: 'no_appointments' };
            }
          } else {
            const msg = 'No se pudieron consultar sus citas. Intente de nuevo o contacte a un asesor.';
            addToHistory(from, 'user', text);
            addToHistory(from, 'assistant', msg);
            if (!isTest) await setCachedReply(text, msg, kv);
            await saveConvHistory(from, kv);
            return { reply: msg, type: 'error' };
          }
        } catch (err) {
          console.error('Get appointments error:', err);
          const msg = 'Hubo un error consultando sus citas. Intente de nuevo.';
          addToHistory(from, 'user', text);
          addToHistory(from, 'assistant', msg);
          if (!isTest) await setCachedReply(text, msg, kv);
          await saveConvHistory(from, kv);
          return { reply: msg, type: 'error' };
        }
      } else {
        const msg = 'Para consultar sus citas necesito su teléfono. ¿Podría proporcionármelo?';
        addToHistory(from, 'user', text);
        addToHistory(from, 'assistant', msg);
        if (!isTest) await setCachedReply(text, msg, kv);
        await saveConvHistory(from, kv);
        return { reply: msg, type: 'awaiting_phone_for_appointments' };
      }
    }

    // Handle appointment selection for cancel/reprogram
    if (state.awaitingCancelConfirmation?.appointments && !state.awaitingCancelConfirmation?.appointmentId) {
      const apps = state.awaitingCancelConfirmation.appointments;
      const num = parseInt(text.trim());
      if (!isNaN(num) && num >= 1 && num <= apps.length) {
        const appt = apps[num - 1];
        setAwaitingCancelConfirmation(from, {
          appointments: apps,
          appointmentId: appt._id,
          appointmentDetails: {
            date: appt.date,
            startTime: appt.startTime,
            endTime: appt.endTime,
            doctorName: appt.doctor?.name || 'Doctor',
            branchName: appt.branch?.name || 'Sucursal',
          },
        });

        let msg = `Cita seleccionada:\n📅 ${appt.date} ${appt.startTime}-${appt.endTime}\n👨‍⚕️ ${appt.doctor?.name || 'Doctor'}\n\n¿Desea cancelar o reprogramar esta cita?\n1. Cancelar\n2. Reprogramar`;
        addToHistory(from, 'user', text);
        addToHistory(from, 'assistant', msg);
        if (!isTest) await setCachedReply(text, msg, kv);
        await saveConvHistory(from, kv);
        return { reply: msg, type: 'cancel_or_reprogram_choice' };
      }
    }

    // Handle cancel/reprogram choice (user said 1 or 2)
    if (state.awaitingCancelConfirmation?.appointmentId && !state.awaitingCancelConfirmation?.choice) {
      const { appointmentId, appointmentDetails } = state.awaitingCancelConfirmation;
      const choice = text.trim() === '1' || text.toLowerCase().includes('cancelar') ? 'cancelar' : text.trim() === '2' || text.toLowerCase().includes('reprogramar') ? 'reprogramar' : null;

      if (!choice) {
        const msg = 'Por favor responda 1 para cancelar o 2 para reprogramar.';
        addToHistory(from, 'user', text);
        addToHistory(from, 'assistant', msg);
        if (!isTest) await setCachedReply(text, msg, kv);
        await saveConvHistory(from, kv);
        return { reply: msg, type: 'cancel_or_reprogram_choice' };
      }

      if (choice === 'cancelar') {
        setAwaitingCancelConfirmation(from, { appointmentId, appointmentDetails, choice: 'cancelar' });
        const msg = `Está a punto de cancelar la cita del ${appointmentDetails.date} ${appointmentDetails.startTime}-${appointmentDetails.endTime}. ¿Confirma? (Sí/No)`;
        addToHistory(from, 'user', text);
        addToHistory(from, 'assistant', msg);
        if (!isTest) await setCachedReply(text, msg, kv);
        await saveConvHistory(from, kv);
        return { reply: msg, type: 'awaiting_cancel_confirmation' };
      } else {
        setAwaitingRescheduleDate(from, appointmentId);
        const msg = '¿Para qué fecha le gustaría reprogramar la cita? (ej: 20/08 o 20/08/2026)';
        addToHistory(from, 'user', text);
        addToHistory(from, 'assistant', msg);
        if (!isTest) await setCachedReply(text, msg, kv);
        await saveConvHistory(from, kv);
        return { reply: msg, type: 'awaiting_reschedule_date' };
      }
    }

    // Detect appointment intent and start flow
    if (appointmentKeywords.test(text) && !state.awaitingAppointment) {
      const formData = getFormData(from);
      const merged = { ...formData, ...fields };
      const serviceCode = findService(text) || findService(formData.servicio || '');
      const tipoCita = /seguimiento|control|revisi[oó]n|chequeo/.test(text) ? 'seguimiento' : 'primera_vez';

      // Check if we have enough info to check availability
      if (merged.nombre && merged.telefono) {
        if (fields.nombre || fields.telefono) setFormData(from, merged);
        setAwaitingAppointment(from, {
          awaitingDate: true,
          serviceCode,
          tipoCita,
          crmData: { contactId: merged.contactId, opportunityId: merged.opportunityId },
        });

        const msg = 'Perfecto. ¿Para qué fecha le gustaría la cita? (ej: 20/08 o 20/08/2026)';
        addToHistory(from, 'user', text);
        addToHistory(from, 'assistant', msg);
        if (!isTest) await setCachedReply(text, msg, kv);
        await saveConvHistory(from, kv);
        return { reply: msg, type: 'awaiting_appointment_date' };
      } else {
        // Need more info first
        const msg = 'Para agendar necesito su nombre y teléfono. ¿Podría proporcionármelos?';
        addToHistory(from, 'user', text);
        addToHistory(from, 'assistant', msg);
        if (!isTest) await setCachedReply(text, msg, kv);
        await saveConvHistory(from, kv);
        return { reply: msg, type: 'awaiting_data' };
      }
    }

    let raw;
    if (env.TEST_MODE == '1' || env.TEST_MODE == true || env.TEST_MODE == 1) {
      console.log('TEST_MODE enabled, using mock response');
      raw = getMockResponse(text, greeting, from, history);
    } else {
      console.log('TEST_MODE disabled, calling LLM');
      const promptText = await getPromptText(kv);
      
      // Detect name for LLM context
      let detectedName = extractNameFromText(text);
      if (!detectedName) {
        const historyNames = getHistory(from).filter(h => h.role === 'user').map(h => h.content);
        const detected = detectFields(historyNames);
        if (detected.nombre) detectedName = detected.nombre;
      }
      
      const prompt = buildPrompt(greeting, history, text, promptText, intent, knowledgeSection, fields, detectedName);
      try {
        raw = await callGemini(env.GEMINI_API_KEY, prompt, kv, env.GROQ_API_KEY);
      } catch (err) {
        console.error('LLM error:', err.message, err.stack);
        const fallback = `Gracias por contactar a UNIDOLOR. En este momento no puedo procesar su consulta, pero un asesor se comunicará con usted pronto.`;
        addToHistory(from, 'user', text);
        addToHistory(from, 'assistant', fallback);
        await saveConvHistory(from, kv);
        const forced = forceFormData(history, text);
        if (forced) {
          if (kv) {
            try {
              const key = `form:latest:${from}`;
              const payload = { phone: from, created: new Date().toISOString(), ...JSON.parse(forced.json) };
              await kv.put(key, JSON.stringify(payload));
              // Also keep timestamped copy for history
              const histKey = `form:${Date.now()}:${from}`;
              await kv.put(histKey, JSON.stringify(payload));
            } catch (e) { console.error('KV save error:', e); }
          }
          return { reply: fallback, type: 'fallback', requiresEscalation: true, summary: forced.json };
        }
        return { reply: fallback, type: 'fallback', requiresEscalation: true };
      }
    }

    const parsed = buildReply(raw);
    let reply = parsed.reply;
    // Enlaza el formulario con el servicio detectado en la conversación (pre-seleccionado)
    const contextualLink = getFormLink(findService(userTexts.join(' ')), from);
    if (reply.includes(`${SITE_URL}/solicitud`) && !reply.includes(`${SITE_URL}/solicitud?`) && contextualLink !== `${SITE_URL}/solicitud`) {
      reply = reply.split(`${SITE_URL}/solicitud`).join(contextualLink);
    }
    const result = { reply, type: isTest ? 'test' : 'gemini' };

    // Extraer nombre del mensaje del usuario (fallback: usar detectFields del historial)
    let extractedName = extractNameFromText(text);
    if (!extractedName) {
      const historyNames = getHistory(from).filter(h => h.role === 'user').map(h => h.content);
      const detected = detectFields(historyNames);
      if (detected.nombre) extractedName = detected.nombre;
    }
    if (extractedName) {
      result.extractedName = extractedName;
    }

    // Solo se considera el formulario "completo" cuando el código confirma que hay
    // datos suficientes para cotizar: NOMBRE + DIRECCIÓN son obligatorios (servicio a
    // domicilio) y al menos un dato de contacto/servicio más. Si el LLM emite FORMDATA
    // antes de tiempo, se descarta para evitar escalar incompleto.
    const enoughForForm = (f) => f.nombre && f.direccion && (f.servicio || f.cedula || f.telefono || f.seguro);

    // Code-level form data detection: si el LLM no emitió FORMDATA pero ya hay datos, forzarla
    if (!parsed.formData) {
      const forced = forceFormData(history, text);
      if (forced) {
        parsed.formData = forced.json;
        parsed.escalation = 'cotización';
      }
    } else if (!enoughForForm(fields)) {
      // LLM emitió FORMDATA prematuro → descartar y seguir recopilando
      parsed.formData = null;
      parsed.escalation = null;
    }

    if (parsed.formData) {
      result.type = 'form_complete';
      result.requiresEscalation = true;
      // Mezclar lo que emitió el LLM con lo detectado por código (state + fields)
      // para que el CRM reciba TODOS los datos (nombre, cédula, dirección, seguro, etc.)
      let llmData = {};
      try { llmData = JSON.parse(parsed.formData) || {}; } catch (e) { llmData = {}; }
      const fullData = { ...llmData, ...getFormData(from), ...fields };
      if (!fullData.telefono) fullData.telefono = from;
      result.summary = JSON.stringify(fullData);
      if (kv) {
        try {
          const key = `form:latest:${from}`;
          const payload = { phone: from, created: new Date().toISOString(), ...fullData };
          await kv.put(key, JSON.stringify(payload));
          // Also keep timestamped copy for history
          const histKey = `form:${Date.now()}:${from}`;
          await kv.put(histKey, JSON.stringify(payload));
        } catch (e) { console.error('KV save error:', e); }
      }
    }
    if (parsed.escalation) {
      result.requiresEscalation = true;
      if (!parsed.formData) {
        result.type = 'escalation';
        result.summary = `Escalación: ${parsed.escalation}`;
      }
    }

    // ── Extracción de datos estructurados con IA (extract.js) ──
    // Se ejecuta en paralelo con la respuesta normal: si los datos están completos,
    // se crea/actualiza el cliente en CRM y se notifica al back-office.
    try {
      const currentExtraction = getExtraction(from) || {};
      const userTextsForExtract = [...history.filter(h => h.role === 'user').map(h => h.content), text];
      const extractionResult = await extractData(env, userTextsForExtract, currentExtraction);

      if (extractionResult && extractionResult.extraction) {
        // Guardar extracción en estado (persistida vía saveConvHistory)
        const extraction = extractionResult.extraction;
        const nombre = extraction.nombre || extraction.patient_name || extraction.caller_name || '';
        const telefono = extraction.telefono || extraction.patient_phone || extraction.caller_phone || '';
        if (nombre) setExtraction(from, { ...extraction, nombre });
        if (nombre && telefono) {
          // Fusionar con formData para compatibilidad con flujo existente
          setFormData(from, { ...getFormData(from), ...extraction, nombre, telefono });
          updateConvNameSafe(from, nombre);
        }

        // Exportar solo si la extracción está completa y aún no escalamos
        const shouldExport = extractionResult.action === 'export' && !result.requiresEscalation;
        if (shouldExport && nombre && telefono) {
          result.requiresEscalation = true;
          result.type = 'extraction_export';
          result.summary = JSON.stringify({ ...extraction, nombre, telefono });
          if (kv) {
            try {
              const key = `form:latest:${from}`;
              const payload = { phone: from, created: new Date().toISOString(), ...extraction, nombre, telefono };
              await kv.put(key, JSON.stringify(payload));
              const histKey = `form:${Date.now()}:${from}`;
              await kv.put(histKey, JSON.stringify(payload));
            } catch (e) { console.error('KV save error (extraction):', e); }
          }
          // Crear/actualizar cliente en CRM
          try {
            const crmResult = await createOrUpdateClient(env, { ...extraction, nombre, telefono });
            if (crmResult.ok && crmResult.contactId) {
              setFormData(from, { contactId: crmResult.contactId, opportunityId: crmResult.opportunityId });
              setExtraction(from, { contactId: crmResult.contactId, opportunityId: crmResult.opportunityId });
              result.crmContactId = crmResult.contactId;
              // Notificar al back-office
              await notifyBackoffice(env, { ...extraction, nombre, telefono }, crmResult, null);
            } else {
              console.error('CRM client creation failed (extraction):', crmResult?.error);
              await notifyBackoffice(env, { ...extraction, nombre, telefono }, null, { success: false, error: crmResult?.error || 'CRM error' });
            }
          } catch (err) {
            console.error('CRM client creation error (extraction):', err.message);
            await notifyBackoffice(env, { ...extraction, nombre, telefono }, null, { success: false, error: err.message });
          }
        }
      }
    } catch (err) {
      console.error('Extraction flow error:', err.message);
    }

    // Lógica proactiva de fotos: si hay datos suficientes pero faltan imágenes
    const formData = getFormData(from);
    const mergedFormData = { ...formData, ...fields };
    
    // Actualizar formData con lo detectado en este mensaje
    if (Object.keys(fields).length > 0) {
      setFormData(from, mergedFormData);
    }

    // ── REQUISITOS UNIFICADOS (fotos de cédula y seguro SIEMPRE obligatorias + números) ──
    const faltanFotos = missingPhotos(state.receivedImages);
    const faltanNumeros = missingNumbers(mergedFormData);

    // Mientras estemos esperando un número por texto, capturarlo y proseguir a las fotos
    if (state.awaitingAfiliado) {
      let numCapturado = mergedFormData.afiliado || fields.afiliado || null;
      if (!numCapturado) {
        const bare = text.trim().match(/^[\d.\- ]{4,20}$/);
        if (bare) numCapturado = bare[0].replace(/\s+/g, '').trim();
        else {
          const parcial = text.match(/(?:es|es el|numero(?: de afiliado)?\s*:?)\s*([\d.\- ]{4,20})/i);
          if (parcial) numCapturado = parcial[1].replace(/\s+/g, '').trim();
        }
      }
      if (numCapturado) {
        clearAwaitingAfiliado(from);
        const update = { seguro: mergedFormData.seguro || getFormData(from).seguro || '' };
        if (fields.afiliado || faltanNumeros.includes('afiliado')) update.afiliado = numCapturado;
        if (faltanNumeros.includes('cedula') && !fields.cedula) update.cedula = numCapturado;
        setFormData(from, update);
        const msg = '✅ Número registrado. Falta enviar las fotos requeridas.';
        if (faltanFotos.length) {
          setAwaitingImages(from, { cedula: faltanFotos.includes('cedula'), seguro: faltanFotos.includes('seguro') });
          addToHistory(from, 'user', text);
          addToHistory(from, 'assistant', buildRequirementsMessage({ ...mergedFormData, ...update }, state.receivedImages));
          if (!isTest) await setCachedReply(text, buildRequirementsMessage({ ...mergedFormData, ...update }, state.receivedImages), kv);
          await saveConvHistory(from, kv);
          return { reply: buildRequirementsMessage({ ...mergedFormData, ...update }, state.receivedImages), type: 'awaiting_images' };
        }
        // Fotos completas y número registrado → formulario completo
        const completo = { ...mergedFormData, ...update };
        const formCompleto = completo.nombre && completo.direccion && (completo.servicio || completo.cedula || completo.telefono || completo.seguro);
        if (formCompleto) {
          const msg = '✅ ¡Listo! Recibimos toda la información. Un asesor se comunicará pronto.';
          addToHistory(from, 'user', text);
          addToHistory(from, 'assistant', msg);
          if (!isTest) await setCachedReply(text, msg, kv);
          await saveConvHistory(from, kv);
          return { reply: msg, type: 'form_complete', requiresEscalation: true, summary: JSON.stringify({ formData: completo, images: state.receivedImages }) };
        }
        addToHistory(from, 'user', text);
        addToHistory(from, 'assistant', msg);
        if (!isTest) await setCachedReply(text, msg, kv);
        await saveConvHistory(from, kv);
        return { reply: msg, type: 'afiliado_collected' };
      }
      const msg = 'No pude identificar el número. Por favor escríbalo (ej. 001-223344-5) o envíe la foto del documento.';
      addToHistory(from, 'user', text);
      addToHistory(from, 'assistant', msg);
      if (!isTest) await setCachedReply(text, msg, kv);
      await saveConvHistory(from, kv);
      return { reply: msg, type: 'awaiting_afiliado' };
    }

    // Si ya tenemos datos base para el formulario, pedir SIEMPRE las fotos faltantes y números
    if (enoughForForm(mergedFormData) && !state.awaitingImages && (faltanFotos.length || faltanNumeros.length)) {
      setAwaitingImages(from, { cedula: faltanFotos.includes('cedula'), seguro: faltanFotos.includes('seguro') });
      if (faltanNumeros.length) setAwaitingAfiliado(from, true);
      const msg = 'Perfecto, ya tengo sus datos. ' + buildRequirementsMessage({ ...mergedFormData, cedula: mergedFormData.cedula, afiliado: mergedFormData.afiliado }, state.receivedImages);
      addToHistory(from, 'user', text);
      addToHistory(from, 'assistant', msg);
      if (!isTest) await setCachedReply(text, msg, kv);
      await saveConvHistory(from, kv);
      return { reply: msg, type: faltanFotos.length ? 'awaiting_images' : 'awaiting_afiliado' };
    }

    // Timeout de imágenes: se chequea ANTES de responder "falta enviar foto" para que
    // un usuario que dejó la conversación no quede atrapado pidiendo fotos para siempre.
    // También cubre estados persistidos sin imagesTimeoutAt válido (>= CONV_TIMEOUT de antigüedad).
    const imgStale = state.awaitingImages && (!state.imagesTimeoutAt || Date.now() > state.imagesTimeoutAt);
    if (imgStale) {
      clearImagesState(from);
      // Limpiar también los datos del formulario acumulados en una sesión previa:
      // si no, detectFields reconstruye los datos desde el historial y reactiva
      // el flujo de fotos en cada mensaje sin importar el timeout.
      state.formData = {};
      addToHistory(from, 'user', text);
      addToHistory(from, 'assistant', 'Puede continuar. Si aún necesita el servicio, le tomamos los datos nuevamente.');
      await saveConvHistory(from, kv);
      return { reply: 'Puede continuar. Si aún necesita el servicio, le tomamos los datos nuevamente.', type: 'images_timeout' };
    }

    // Si el usuario escribió un número faltante mientras esperamos fotos, capturarlo
    if (state.awaitingImages) {
      const update = {};
      if (mergedFormData.cedula && faltanNumeros.includes('cedula')) update.cedula = mergedFormData.cedula;
      if (mergedFormData.afiliado && faltanNumeros.includes('afiliado')) update.afiliado = mergedFormData.afiliado;
      if (Object.keys(update).length) setFormData(from, update);
      // Las fotos de cédula y seguro son OBLIGATORIAS: el texto no las sustituye
      const recalcMissing = missingPhotos(state.receivedImages);
      if (recalcMissing.length === 0) {
        clearImagesState(from);
      } else {
        let msg = 'Recibido. \u2022 Falta enviar: ' + recalcMissing.map(m => (m === 'cedula' ? '📷 foto de su cédula' : '📷 foto del carnet de seguro')).join(' y ') + '.';
        addToHistory(from, 'user', text);
        addToHistory(from, 'assistant', msg);
        if (!isTest) await setCachedReply(text, msg, kv);
        await saveConvHistory(from, kv);
        return { reply: msg, type: 'awaiting_images' };
      }
    }

    addToHistory(from, 'user', text);
    addToHistory(from, 'assistant', reply);
    if (!isTest) {
      await setCachedReply(text, reply, kv);
    }
    await saveConvHistory(from, kv);
    return result;
  }

  async function handleImage(from, mediaId, mimeType, env) {
    const kv = env.SEGUIMIENTO;
    await loadConvHistory(from, kv);
    
    const state = getConvState(from);
    const formData = getFormData(from);
    
    // Log user image message to history
    addToHistory(from, 'user', `[imagen: ${mimeType}]`);
    
    // Procesar imagen: descargar, OCR (sin almacenar)
    const { downloadMedia, callGeminiVision, arrayBufferToBase64, mergeExtractedData: mergeData, inferDocumentType: inferType } = await import('./images.js');
    
    try {
      const { bytes } = await downloadMedia(env, mediaId);
      const base64 = arrayBufferToBase64(bytes);
      const extracted = await callGeminiVision(env.GEMINI_API_KEY, base64, mimeType);
      
      const tipo = extracted.tipoDocumento || inferType(extracted);
      const imageData = { extracted, receivedAt: Date.now() };
      addReceivedImage(from, tipo, imageData);
      
      const merged = mergeData(formData, extracted, tipo);
      setFormData(from, merged);
      
      // Verificar si ya tenemos todo (fotos OBLIGATORIAS de ambos + números)
      const faltanFotosImg = missingPhotos(state.receivedImages);
      const faltanNumerosImg = missingNumbers(merged);
      let reply;
      if (faltanFotosImg.length === 0) {
        clearImagesState(from);
        const enoughForForm = (f) => f.nombre && f.direccion && (f.servicio || f.cedula || f.telefono || f.seguro);
        if (faltanNumerosImg.length) {
          setAwaitingAfiliado(from, true);
          reply = '✅ Fotos recibidas. ' + buildRequirementsMessage(merged, state.receivedImages);
          return { reply, type: 'awaiting_afiliado' };
        }
        if (enoughForForm(merged)) {
          reply = '¡Gracias! Recibimos sus documentos. Un asesor se comunicará pronto.';
          return { 
            reply, 
            type: 'form_complete', 
            requiresEscalation: true, 
            summary: JSON.stringify({ formData: merged, images: state.receivedImages }) 
          };
        }
        reply = 'Recibido. Faltan algunos datos. ¿Puede proporcionarnos su dirección y el servicio que necesita?';
        return { reply, type: 'awaiting_data' };
      } else {
        let msg = 'Recibido. \u2022 Falta enviar: ' + faltanFotosImg.map(m => (m === 'cedula' ? '📷 foto de su cédula' : '📷 foto del carnet de seguro')).join(' y ') + '.';
        reply = msg;
        return { reply, type: 'awaiting_images' };
      }
    } catch (err) {
      console.error('Image processing error:', err);
      reply = 'Hubo un error procesando la imagen. Por favor intente de nuevo o envíe los datos por texto.';
      return { reply, type: 'error' };
    } finally {
      addToHistory(from, 'assistant', reply);
      await saveConvHistory(from, kv);
    }
  }

  return { handleMessage, handleImage };
}

async function cleanupFollowUps(kv, from) {
  if (!kv) return;
  try {
    const prefix = `fu_${from}_`;
    const list = await kv.list({ prefix });
    for (const key of list.keys) {
      await kv.delete(key.name);
    }
  } catch (err) {
    console.error('Cleanup follow-ups error:', err);
  }
}

function forceFormData(history, currentText) {
  const allUserText = history.filter(h => h.role === 'user').map(h => h.content);
  allUserText.push(currentText);
  const f = detectFields(allUserText);

  // NOMBRE + DIRECCIÓN obligatorios (servicio a domicilio) + al menos un dato más.
  if (f.nombre && f.direccion && (f.servicio || f.cedula || f.telefono || f.seguro)) {
    const data = {};
    if (f.nombre) data.nombre = f.nombre;
    if (f.cedula) data.cedula = f.cedula;
    if (f.servicio) data.servicio = f.servicioLabel || f.servicio;
    if (f.direccion) data.direccion = f.direccion;
    if (f.telefono) data.telefono = f.telefono;
    if (f.seguro) data.seguro = f.seguro;
    if (f.afiliado) data.afiliado = f.afiliado;
    if (f.email) data.email = f.email;
    if (f.fecha_nacimiento) data.fecha_nacimiento = f.fecha_nacimiento;
    if (f.genero) data.genero = f.genero;
    if (f.sucursal) data.sucursal = f.sucursal;
    if (f.notas) data.notas = f.notas;
    if (f.requisitos) data.requisitos = f.requisitos;
    if (f.relationship) data.relationship = f.relationship;
    if (f.patient_name) data.patient_name = f.patient_name;
    if (f.patient_phone) data.patient_phone = f.patient_phone;
    if (f.caller_name) data.caller_name = f.caller_name;
    if (f.caller_phone) data.caller_phone = f.caller_phone;
    if (!data.nombre) data.nombre = '(solicitado)';
    data.fotos_solicitadas = true;
    return { json: JSON.stringify(data) };
  }
  return null;
}

function extractNameFromText(text) {
  const t = text.trim();
  const patterns = [
    /^(?:hola|buenos?\s+d[ií]as|buenas\s+tardes|buenas\s+noches)[\s,;]*(?:soy|me\s+llamo|mi\s+nombre\s+es|mi\s+nombre\s+es)\s+([A-ZÁÉÍÓÚÑ][a-záéíóúñ]+(?:\s+[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+){0,2})/i,
    /^(?:soy|me\s+llamo|mi\s+nombre\s+es)\s+([A-ZÁÉÍÓÚÑ][a-záéíóúñ]+(?:\s+[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+){0,2})/i,
    /^([A-ZÁÉÍÓÚÑ][a-záéíóúñ]+(?:\s+[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+){0,2})\s*(?:aqu[ií]|por\s+aqu[ií])/i,
    /(?:le\s+habla|es|soy)\s+(?:la\s+)?(?:sra?\.?|sr?\.?|don|doña)?\s*([A-ZÁÉÍÓÚÑ][a-záéíóúñ]+(?:\s+[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+){1,2})/i,
    /(?:mi\s+(?:esposa|esposo|madre|padre|hijo|hija|familiar)\s+(?:es|se\s+llama))\s+([A-ZÁÉÍÓÚÑ][a-záéíóúñ]+(?:\s+[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+){1,2})/i,
  ];
  
  for (const pattern of patterns) {
    const match = t.match(pattern);
    if (match && match[1]) {
      const name = match[1].trim();
      if (name.length >= 3 && name.length <= 50 && !/^\d+$/.test(name)) {
        return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
      }
    }
  }
  return null;
}

async function updateConvNameSafe(from, nombre) {
  if (!nombre) return;
  const clean = String(nombre).trim();
  if (!clean || clean === '(solicitado)' || /^\d/.test(clean) || clean.length < 3) return;
  // No hacer nada aquí directamente; la persistencia del nombre de conversación
  // la maneja index.js via updateConvName. Este helper solo valida.
  return clean;
}
