const prisma = require('@/db/prisma');
const { institutionalConfig } = require('@/settings');

const REQUIRED_PATIENT_FIELDS = institutionalConfig.informacionMinimaPaciente;

const handleBotWebhook = async (req, res) => {
  const WEBHOOK_API_KEY = process.env.WEBHOOK_API_KEY || 'unidolor-webhook-key-2026';

  const apiKey = req.headers['x-api-key'];
  if (!apiKey || apiKey !== WEBHOOK_API_KEY) {
    return res.status(401).json({ success: false, message: 'Invalid API key' });
  }

  const {
    nombre, first_name, last_name, telefono, cedula, fecha_nacimiento,
    email, direccion, servicio, servicioCode, tipoCita, preferredDate,
    preferredTime, notes, notas, seguro, afiliado, genero, sucursal,
    requisitos, fuente, caller_phone, caller_name, relationship,
    patient_name, patient_phone, source_channel,
  } = req.body;

  const finalNotes = notas || notes || '';

  const missingFields = [];
  if (!nombre) missingFields.push('nombre');
  if (!telefono) missingFields.push('telefono');
  if (!direccion) missingFields.push('direccion');
  if (!servicio) missingFields.push('servicio');
  if (!seguro) missingFields.push('seguro');
  if (!cedula) missingFields.push('cedula (documentoIdentidad)');
  if (!fecha_nacimiento) missingFields.push('fecha_nacimiento');
  if (!genero) missingFields.push('genero (sexo)');
  if (!fuente) missingFields.push('fuente');

  if (missingFields.length > 0) {
    return res.status(400).json({
      success: false,
      message: `Campos obligatorios faltantes: ${missingFields.join(', ')}`,
      missingFields,
      requiredFields: REQUIRED_PATIENT_FIELDS,
    });
  }

  let client = await prisma.client.findFirst({
    where: {
      OR: [
        { phone: telefono },
        ...(cedula ? [{ identityNumber: cedula }] : []),
      ],
    },
  });

  if (!client) {
    client = await prisma.client.create({
      data: {
        name: nombre,
        phone: telefono,
        address: direccion || '',
        email: email || '',
        identityNumber: cedula || '',
        metadata: {
          fecha_nacimiento, seguro, afiliado, genero, sucursal, requisitos,
          servicio, notas: finalNotes, caller_phone, caller_name,
          relationship: relationship || 'mismo', patient_name, patient_phone,
          source_channel: source_channel || 'whatsapp',
        },
      },
    });
  } else {
    const updates = {};
    if (direccion && !client.address) updates.address = direccion;
    if (email && !client.email) updates.email = email;
    if (cedula && !client.identityNumber) updates.identityNumber = cedula;
    const metaUpdates = {};
    if (fecha_nacimiento) metaUpdates.fecha_nacimiento = fecha_nacimiento;
    if (seguro) metaUpdates.seguro = seguro;
    if (afiliado) metaUpdates.afiliado = afiliado;
    if (genero) metaUpdates.genero = genero;
    if (sucursal) metaUpdates.sucursal = sucursal;
    if (requisitos) metaUpdates.requisitos = requisitos;
    if (caller_phone) metaUpdates.caller_phone = caller_phone;
    if (caller_name) metaUpdates.caller_name = caller_name;
    if (relationship) metaUpdates.relationship = relationship;
    if (patient_name) metaUpdates.patient_name = patient_name;
    if (patient_phone) metaUpdates.patient_phone = patient_phone;
    if (source_channel) metaUpdates.source_channel = source_channel;
    if (Object.keys(metaUpdates).length > 0) {
      updates.metadata = { ...(client.metadata || {}), ...metaUpdates };
    }
    if (Object.keys(updates).length > 0) {
      await prisma.client.update({ where: { id: client.id }, data: updates });
    }
  }

  const recentAppointment = await prisma.appointment.findFirst({
    where: { clientId: client.id, removed: false, status: { not: 'cancelada' } },
    orderBy: { date: 'desc' },
  });

  const isFollowUp = tipoCita === 'seguimiento' || (recentAppointment && /seguimiento|control|revisi[oó]n/.test(finalNotes));
  const finalTipoCita = isFollowUp ? 'seguimiento' : 'primera_vez';

  let opportunity = await prisma.opportunity.findFirst({
    where: {
      clientId: client.id,
      stage: { in: ['cotizacion', 'cita_solicitada', 'cita_programada'] },
      removed: false,
    },
    orderBy: { created: 'desc' },
  });

  if (!opportunity) {
    opportunity = await prisma.opportunity.create({
      data: {
        clientId: client.id,
        stage: 'cita_solicitada',
        service: servicio || '',
        source: fuente || 'whatsapp',
        notes: finalNotes,
        metadata: {
          seguro, afiliado, tipoCita: finalTipoCita, genero, sucursal, requisitos,
          caller_phone, caller_name, relationship: relationship || 'mismo',
          patient_name, patient_phone, source_channel: source_channel || 'whatsapp',
        },
      },
    });
  } else {
    opportunity = await prisma.opportunity.update({
      where: { id: opportunity.id },
      data: {
        stage: 'cita_solicitada',
        service: servicio || opportunity.service,
        notes: finalNotes || opportunity.notes,
        metadata: {
          ...(opportunity.metadata || {}),
          seguro, afiliado, tipoCita: finalTipoCita, genero, sucursal, requisitos,
          caller_phone, caller_name, relationship: relationship || 'mismo',
          patient_name, patient_phone, source_channel: source_channel || 'whatsapp',
        },
      },
    });
  }

  await prisma.notification.create({
    data: {
      type: 'webhook_bot',
      title: `Nueva solicitud de cita: ${nombre}`,
      message: `${servicio || 'Sin servicio'} - ${finalTipoCita === 'seguimiento' ? 'Seguimiento' : 'Primera vez'}`,
      link: '/pipeline',
      modelId: opportunity.id,
    },
  });

  return res.status(201).json({
    success: true,
    contactId: client.id,
    opportunityId: opportunity.id,
    isExistingPatient: !!recentAppointment,
    suggestedTipoCita: finalTipoCita,
    lastAppointment: recentAppointment
      ? { date: recentAppointment.date, doctor: recentAppointment.doctorId, service: recentAppointment.type }
      : null,
  });
};

const handleCreateCase = async (req, res) => {
  const WEBHOOK_API_KEY = process.env.WEBHOOK_API_KEY || 'unidolor-webhook-key-2026';
  const apiKey = req.headers['x-api-key'];
  if (!apiKey || apiKey !== WEBHOOK_API_KEY) {
    return res.status(401).json({ success: false, message: 'Invalid API key' });
  }

  const { clientPhone, motivoContacto, servicioCodigo, procedimientoCodigo, notes, source } = req.body;

  if (!clientPhone) {
    return res.status(400).json({ success: false, message: 'clientPhone es obligatorio' });
  }

  const client = await prisma.client.findFirst({ where: { phone: clientPhone } });
  if (!client) {
    return res.status(404).json({ success: false, message: 'Cliente no encontrado. Sincronice primero el cliente.' });
  }

  let servicioRef = null;
  if (servicioCodigo) {
    servicioRef = await prisma.service.findFirst({ where: { cupsCode: servicioCodigo, removed: false } });
  }

  const caseCount = await prisma.case.count();
  const year = new Date().getFullYear();
  const caseNumber = `CASO-${year}-${String(caseCount + 1).padStart(4, '0')}`;

  const caseData = {
    caseNumber,
    client: { connect: { id: client.id } },
    motivoContacto: motivoContacto || {},
    servicioCodigo: servicioCodigo || '',
    servicioLabel: servicioRef ? servicioRef.name : servicioCodigo || '',
    notes: notes ? [notes] : [],
    source: source || 'whatsapp',
    canalContacto: source === 'whatsapp' ? 'whatsapp_bot' : source === 'web' ? 'formulario_web' : 'otro',
    status: 'abierto',
  };

  if (servicioRef) {
    caseData.servicio = { connect: { id: servicioRef.id } };
  }

  if (procedimientoCodigo) {
    caseData.procedimientoCodigo = procedimientoCodigo;
  }

  const newCase = await prisma.case.create({ data: caseData });

  await prisma.notification.create({
    data: {
      type: 'new_case',
      title: `Nuevo caso: ${newCase.caseNumber}`,
      message: `${motivoContacto?.tipo || 'sin motivo'} — ${servicioCodigo || 'sin servicio asignado'}`,
      link: '/pipeline',
      modelId: newCase.id,
    },
  });

  return res.status(201).json({
    success: true,
    caseId: newCase.id,
    caseNumber: newCase.caseNumber,
    status: newCase.status,
  });
};

module.exports = { handleBotWebhook, handleCreateCase };
