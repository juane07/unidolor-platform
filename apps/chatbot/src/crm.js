async function sendToCRM(env, data) {
  const url = env.CRM_WEBHOOK_URL;
  if (!url) {
    console.log('CRM_WEBHOOK_URL not configured, skipping CRM sync');
    return { ok: false, error: 'CRM_WEBHOOK_URL no configurado' };
  }

  const apiKey = env.CRM_API_KEY || 'unidolor-webhook-key-2026';

  const nombre = data.nombre || data.paciente || '';
  const primerNombre = data.first_name || '';
  const apellido = data.last_name || '';
  const nombreFinal = nombre || (primerNombre && apellido ? `${primerNombre} ${apellido}` : primerNombre || apellido || '');
  const telefono = data.telefono || data.phone || '';

  if (!nombreFinal || !telefono) {
    console.log('CRM sync skipped: missing nombre or telefono', { nombre: nombreFinal, telefono });
    return { ok: false, error: 'Faltan nombre o teléfono' };
  }

  const payload = {
    nombre: nombreFinal,
    first_name: primerNombre,
    last_name: apellido,
    telefono,
    cedula: data.cedula || '',
    direccion: data.direccion || '',
    servicio: data.servicio || '',
    seguro: data.seguro || '',
    afiliado: data.afiliado || '',
    email: data.email || '',
    fecha_nacimiento: data.fecha_nacimiento || '',
    genero: data.genero || '',
    sucursal: data.sucursal || '',
    notas: data.notas || '',
    requisitos: data.requisitos || {},
    // Quién agenda vs paciente
    caller_phone: data.caller_phone || '',
    caller_name: data.caller_name || '',
    relationship: data.relationship || 'mismo',
    patient_name: data.patient_name || '',
    patient_phone: data.patient_phone || '',
    source_channel: data.source_channel || 'whatsapp',
    fuente: 'whatsapp',
  };

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const text = await res.text();
      console.error('CRM webhook error:', res.status, text);
      return { ok: false, error: `CRM error ${res.status}: ${text}` };
    }

    const result = await res.json();
    console.log('CRM sync success:', result);
    return { ok: true, contactId: result.contactId, opportunityId: result.opportunityId };
  } catch (err) {
    console.error('CRM sync error:', err.message);
    return { ok: false, error: err.message };
  }
}

const CRM_BASE_DEFAULT = 'https://unidolor-crm-production.up.railway.app';

async function fetchCRM(env, path, options = {}) {
  const apiKey = env.CRM_API_KEY || 'unidolor-webhook-key-2026';
  const base = env.CRM_BASE_URL || CRM_BASE_DEFAULT;
  const url = `${base}${path}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      ...(options.headers || {}),
    },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`CRM ${res.status}: ${text}`);
  }
  return res.json();
}

export async function checkAvailability(env, { from, to, type = 'primera_vez', limit = 20 }) {
  const params = new URLSearchParams({ from, to, type });
  if (limit) params.set('limit', limit.toString());
  return fetchCRM(env, `/public/schedule/available?${params}`);
}

export async function createAppointment(env, data) {
  return fetchCRM(env, '/public/appointment/create', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function getAppointmentsByClient(env, phone) {
  const params = new URLSearchParams({ client_phone: phone });
  return fetchCRM(env, `/public/appointment?${params}`);
}

export async function cancelAppointment(env, appointmentId) {
  return fetchCRM(env, `/public/appointment/${appointmentId}/cancel`, {
    method: 'POST',
  });
}

export async function rescheduleAppointment(env, appointmentId, data) {
  return fetchCRM(env, `/public/appointment/${appointmentId}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function createOrUpdateClient(env, extraction) {
  const data = extraction || {};
  const nombre = data.nombre || data.patient_name || data.caller_name || '';
  const telefono = data.telefono || data.patient_phone || data.caller_phone || '';
  const primerNombre = nombre.split(' ')[0] || '';
  const apellido = nombre.split(' ').slice(1).join(' ') || '';

  if (!nombre || !telefono) {
    return { ok: false, error: 'Faltan nombre o teléfono para crear cliente' };
  }

  const result = await sendToCRM(env, {
    nombre,
    first_name: primerNombre,
    last_name: apellido,
    telefono,
    cedula: data.cedula || '',
    direccion: data.direccion || '',
    servicio: data.servicio || '',
    seguro: data.seguro || '',
    afiliado: data.afiliado || '',
    email: data.email || '',
    fecha_nacimiento: data.fecha_nacimiento || '',
    genero: data.genero || '',
    sucursal: data.sucursal || '',
    notas: data.notas || '',
    requisitos: data.requisitos || {},
    caller_phone: data.caller_phone || '',
    caller_name: data.caller_name || '',
    relationship: data.relationship || 'mismo',
    patient_name: data.patient_name || '',
    patient_phone: data.patient_phone || '',
    source_channel: 'whatsapp',
    fuente: 'whatsapp',
  });

  return result;
}

// Resumen unificado: datos del paciente + servicio/cita agendado.
// forUser=true → formato de confirmación para el paciente.
// forUser=false → formato para verificación humana (back-office), con headers técnicos.
export function buildServiceSummary(extraction, appointmentResult, opts = {}) {
  const { forUser = true, crmResult = null } = opts;
  const d = extraction || {};
  const servicio = d.servicioLabel || d.servicio || '';
  const nombre = d.nombre || d.patient_name || d.caller_name || '';
  const telefono = d.telefono || d.patient_phone || d.caller_phone || '';
  const direccion = d.direccion || '';
  const seguro = d.seguro || '';
  const cedula = d.cedula || '';
  const afiliado = d.afiliado || '';
  const email = d.email || '';
  const fecha_nacimiento = d.fecha_nacimiento || '';
  const genero = d.genero || '';
  const sucursal = d.sucursal || '';
  const notas = d.notas || '';
  const relationship = d.relationship || '';
  const caller = d.caller_name || '';
  const motivo = d.motivo || '';
  const requisitos = typeof d.requisitos === 'object' && d.requisitos ? Object.entries(d.requisitos).map(([k, v]) => `${k}: ${v}`).join(', ') : '';

  const pacNombre = d.patient_name || d.nombre || d.caller_name || '';
  const esParaOtro = d.patient_name && d.patient_name !== d.nombre && d.nombre && d.patient_name !== d.nombre;

  let msg;
  if (forUser) {
    msg = `✅ ¡Listo ${nombre.split(' ')[0] || ''}! Registramos su solicitud:\n\n👤 Paciente: ${pacNombre}`;
  } else {
    msg = `══════ 🟢 CLIENTE / CITA ══════\n👤 Paciente: ${pacNombre}`;
  }

  if (!forUser) {
    if (caller && caller !== pacNombre) {
      msg += `\n📞 Quién agenda: ${caller}`;
    } else if (relationship && relationship !== 'mismo') {
      msg += `\n📞 Quién agenda: ${relationship} (desde el chat, sin nombre)`;
    }
  }
  msg += `\n📱 Teléfono: ${telefono}\n🩺 Servicio: ${servicio}`;
  if (motivo) msg += `\n📝 Motivo: ${motivo}`;
  if (direccion) msg += `\n🏠 Dirección: ${direccion}`;
  if (cedula) msg += `\n🪪 Cédula: ${cedula}`;
  if (seguro) msg += `\n🏥 Seguro: ${seguro}`;
  if (afiliado) msg += `\n📇 Afiliado: ${afiliado}`;
  if (email) msg += `\n📧 Email: ${email}`;
  if (fecha_nacimiento) msg += `\n🎂 F. nacimiento: ${fecha_nacimiento}`;
  if (genero) msg += `\n⚧ Género: ${genero}`;
  if (sucursal) msg += `\n🏢 Sucursal: ${sucursal}`;
  if (requisitos) msg += `\n📄 Requisitos: ${requisitos}`;
  if (notas) msg += `\n🗒️ Notas: ${notas}`;
  if (!forUser && crmResult && crmResult.contactId) msg += `\n🆔 CRM Contact: ${crmResult.contactId}`;

  if (appointmentResult && appointmentResult.success) {
    msg += `\n\n✅ SERVICIO AGENDADO:\n📅 Fecha: ${appointmentResult.date}\n⏰ Hora: ${appointmentResult.startTime}-${appointmentResult.endTime}\n👨‍⚕️ Doctor: ${appointmentResult.doctorName || appointmentResult.doctor || ''}\n🏥 Sucursal: ${appointmentResult.branchName || appointmentResult.branch || ''}`;
    if (appointmentResult.appointmentId) msg += `\n🆔 Cita ID: ${appointmentResult.appointmentId}`;
  } else if (appointmentResult && appointmentResult.error) {
    msg += `\n\n⚠️ No se pudo agendar: ${appointmentResult.error}`;
  }

  if (forUser) {
    msg += `\n\nUn asesor humano verificará su solicitud.`;
  } else {
    msg += `\n─────────────────────────\nUNIDOLOR`;
  }
  return msg;
}

export async function notifyBackoffice(env, extraction, crmResult, appointmentResult) {
  if (!env.BACKOFFICE_PHONE) {
    console.log('BACKOFFICE_PHONE not configured, skipping back-office notification');
    return { ok: false, error: 'BACKOFFICE_PHONE no configurado' };
  }
  if (!env.META_ACCESS_TOKEN || !env.META_PHONE_NUMBER_ID) {
    console.log('WhatsApp not configured, skipping back-office notification');
    return { ok: false, error: 'WhatsApp no configurado' };
  }

  const msg = buildServiceSummary(extraction, appointmentResult, {
    forUser: false,
    crmResult,
  });

  const url = `https://graph.facebook.com/v22.0/${env.META_PHONE_NUMBER_ID}/messages`;
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.META_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: env.BACKOFFICE_PHONE,
        type: 'text',
        text: { preview_url: false, body: msg },
      }),
    });
    if (!res.ok) {
      const err = await res.text();
      console.error('Back-office notification error:', res.status, err);
      return { ok: false, error: `WhatsApp ${res.status}: ${err}` };
    }
    return { ok: true };
  } catch (err) {
    console.error('Back-office notification error:', err.message);
    return { ok: false, error: err.message };
  }
}

export async function createCaseInCRM(env, { clientPhone, motivoContacto, servicioCodigo, procedimientoCodigo, notes, source }) {
  const url = env.CRM_WEBHOOK_URL;
  if (!url) {
    console.log('CRM_WEBHOOK_URL not configured, skipping case creation');
    return { ok: false, error: 'CRM_WEBHOOK_URL no configurado' };
  }

  const apiKey = env.CRM_API_KEY || 'unidolor-webhook-key-2026';

  // Construir URL del endpoint de cases
  const caseUrl = url.replace('/webhook/bot', '/webhook/case');

  const payload = {
    clientPhone,
    motivoContacto: motivoContacto || {},
    servicioCodigo: servicioCodigo || '',
    procedimientoCodigo: procedimientoCodigo || '',
    notes: notes || '',
    source: source || 'whatsapp',
  };

  try {
    const res = await fetch(caseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const text = await res.text();
      console.error('CRM case creation error:', res.status, text);
      return { ok: false, error: `CRM error ${res.status}: ${text}` };
    }

    const result = await res.json();
    console.log('CRM case creation success:', result);
    return { ok: true, caseId: result.caseId, caseNumber: result.caseNumber };
  } catch (err) {
    console.error('CRM case creation error:', err.message);
    return { ok: false, error: err.message };
  }
}

export { sendToCRM };

export async function sendBackofficePhoto(env, base64, caption) {
  if (!env.BACKOFFICE_PHONE || !env.META_ACCESS_TOKEN || !env.META_PHONE_NUMBER_ID) {
    console.log('Backoffice WhatsApp no configurado, saltando foto');
    return { ok: false, error: 'WhatsApp backoffice no configurado' };
  }
  if (!base64) return { ok: false, error: 'Sin base64' };
  try {
    const bytes = Uint8Array.from(atob(base64), c => c.charCodeAt(0));
    const mimeType = bytes[0] === 0xFF && bytes[1] === 0xD8 ? 'image/jpeg'
      : bytes[0] === 0x89 && bytes[1] === 0x50 ? 'image/png'
      : bytes[0] === 0x52 && bytes[1] === 0x49 ? 'image/webp'
      : 'image/jpeg';
    const ext = mimeType.split('/')[1] === 'jpeg' ? 'jpg' : mimeType.split('/')[1];

    const uploadUrl = `https://graph.facebook.com/v22.0/${env.META_PHONE_NUMBER_ID}/media`;
    const form = new FormData();
    form.append('messaging_product', 'whatsapp');
    form.append('type', mimeType);
    form.append('file', new Blob([bytes], { type: mimeType }), `doc.${ext}`);
    const up = await fetch(uploadUrl, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${env.META_ACCESS_TOKEN}` },
      body: form,
    });
    if (!up.ok) {
      const err = await up.text();
      console.error('Media upload error:', up.status, err);
      return { ok: false, error: `Upload ${up.status}: ${err}` };
    }
    const upData = await up.json();
    const mediaId = upData.id;
    if (!mediaId) return { ok: false, error: 'Sin media id' };

    const msgUrl = `https://graph.facebook.com/v22.0/${env.META_PHONE_NUMBER_ID}/messages`;
    const res = await fetch(msgUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.META_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: env.BACKOFFICE_PHONE,
        type: 'image',
        image: { id: mediaId, caption: caption || '' },
      }),
    });
    if (!res.ok) {
      const err = await res.text();
      console.error('Backoffice photo send error:', res.status, err);
      return { ok: false, error: `Send ${res.status}: ${err}` };
    }
    return { ok: true };
  } catch (err) {
    console.error('Backoffice photo error:', err.message);
    return { ok: false, error: err.message };
  }
}
