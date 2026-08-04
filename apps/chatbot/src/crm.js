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

export { sendToCRM };
