async function fetchWithTimeout(url, options, timeoutMs = 15000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

function headers(env) {
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${env.NIMBO_ACCESS_TOKEN || ''}`,
  };
}

function baseUrl(env) {
  return (env.NIMBO_BASE_URL || 'https://api.nimbo.app') + '/api/v1';
}

const RD_COUNTRY_ID = '142';
const UNIDOLOR_ACCOUNT_ID = '';

export async function searchPatient(env, query) {
  if (!query) return { ok: false, error: 'Texto de búsqueda requerido' };
  try {
    const url = `${baseUrl(env)}/people?q=${encodeURIComponent(query)}`;
    const res = await fetchWithTimeout(url, { headers: headers(env) });
    if (!res.ok) {
      const text = await res.text();
      return { ok: false, error: `Nimbo search error ${res.status}: ${text}` };
    }
    const data = await res.json();
    if (data.people && data.people.length > 0) {
      return { ok: true, patients: data.people, count: data.people.length };
    }
    if (Array.isArray(data) && data.length > 0) {
      return { ok: true, patients: data, count: data.length };
    }
    return { ok: true, patients: [], count: 0 };
  } catch (err) {
    return { ok: false, error: `Nimbo search error: ${err.message}` };
  }
}

export async function getPatient(env, personId) {
  if (!personId) return { ok: false, error: 'ID de paciente requerido' };
  try {
    const url = `${baseUrl(env)}/people/${personId}`;
    const res = await fetchWithTimeout(url, { headers: headers(env) });
    if (!res.ok) {
      const text = await res.text();
      return { ok: false, error: `Nimbo get error ${res.status}: ${text}` };
    }
    const data = await res.json();
    return { ok: true, patient: data.person || data };
  } catch (err) {
    return { ok: false, error: `Nimbo get error: ${err.message}` };
  }
}

export async function createPatient(env, data) {
  const first_name = data.first_name || '';
  const last_name = data.last_name || '';
  if (!first_name || !last_name) {
    return { ok: false, error: 'Nombre y apellido requeridos' };
  }
  try {
    const body = {
      person: {
        first_name,
        last_name,
        telephone2: data.telefono || data.phone || data.telephone2 || '',
        without_cellphone: !(data.telefono || data.phone || data.telephone2),
        phone_country_id: data.phone_country_id || RD_COUNTRY_ID,
        account_id: data.account_id || UNIDOLOR_ACCOUNT_ID,
      },
    };

    if (data.email) body.person.email = data.email;
    if (data.fecha_nacimiento || data.born_at) body.person.born_at = data.fecha_nacimiento || data.born_at;
    if (data.genero) body.person.gender = data.genero === 'Masculino' ? 'm' : data.genero === 'Femenino' ? 'f' : 'o';
    if (data.notas) body.person.notes = data.notas;
    if (data.direccion || data.address) body.person.address_street = data.direccion || data.address;

    if (data.identity_number || data.cedula) {
      body.person.person_attributes = {
        send_reminders: data.send_reminders !== false,
        identity_number: data.identity_number || data.cedula || '',
      };
    } else if (data.send_reminders !== undefined) {
      body.person.person_attributes = { send_reminders: data.send_reminders };
    }

    const url = `${baseUrl(env)}/people`;
    const res = await fetchWithTimeout(url, {
      method: 'POST',
      headers: headers(env),
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const text = await res.text();
      return { ok: false, error: `Nimbo create error ${res.status}: ${text}` };
    }
    const result = await res.json();
    return { ok: true, person_id: result.person?.id || result.id };
  } catch (err) {
    return { ok: false, error: `Nimbo create error: ${err.message}` };
  }
}

export async function updatePatient(env, personId, data) {
  if (!personId) return { ok: false, error: 'ID de paciente requerido' };
  try {
    const body = { person: {} };
    if (data.first_name) body.person.first_name = data.first_name;
    if (data.last_name) body.person.last_name = data.last_name;
    if (data.telefono || data.telephone2) body.person.telephone2 = data.telefono || data.telephone2;
    if (data.email !== undefined) body.person.email = data.email;
    if (data.fecha_nacimiento || data.born_at) body.person.born_at = data.fecha_nacimiento || data.born_at;
    if (data.genero) body.person.gender = data.genero === 'Masculino' ? 'm' : data.genero === 'Femenino' ? 'f' : 'o';
    if (data.notas !== undefined) body.person.notes = data.notas;
    if (data.direccion || data.address) body.person.address_street = data.direccion || data.address;

    const url = `${baseUrl(env)}/people/${personId}`;
    const res = await fetchWithTimeout(url, {
      method: 'PUT',
      headers: headers(env),
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const text = await res.text();
      return { ok: false, error: `Nimbo update error ${res.status}: ${text}` };
    }
    const result = await res.json();
    return { ok: true, person_id: result.person?.id || result.id };
  } catch (err) {
    return { ok: false, error: `Nimbo update error: ${err.message}` };
  }
}

export async function createConsultation(env, personId, data) {
  if (!personId) return { ok: false, error: 'ID de paciente requerido' };
  if (!data.servicio && !data.cause) return { ok: false, error: 'Servicio o motivo requerido' };
  if (!data.account_id) return { ok: false, error: 'account_id requerido (médico tratante)' };
  try {
    const body = {
      consultation: {
        cause: data.cause || data.servicio || '',
        starts_at: data.starts_at || new Date().toISOString(),
        finished_at: data.finished_at || null,
        account_id: data.account_id,
        person_id: String(personId),
        meta: {
          source: 'patient_profile',
          encounter_type_id: data.encounter_type_id || null,
        },
      },
    };

    const url = `${baseUrl(env)}/consultations`;
    const res = await fetchWithTimeout(url, {
      method: 'POST',
      headers: headers(env),
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const text = await res.text();
      return { ok: false, error: `Nimbo consultation error ${res.status}: ${text}` };
    }
    const result = await res.json();
    return { ok: true, consultation_id: result.consultation?.id || result.id };
  } catch (err) {
    return { ok: false, error: `Nimbo consultation error: ${err.message}` };
  }
}

export async function createAppointment(env, personId, data) {
  if (!personId) return { ok: false, error: 'ID de paciente requerido' };
  if (!data.account_id) return { ok: false, error: 'account_id requerido' };
  if (!data.starts_at) return { ok: false, error: 'starts_at requerido' };
  if (!data.ends_at) return { ok: false, error: 'ends_at requerido' };
  try {
    const body = {
      consultation_schedule: {
        cause: data.cause || data.servicio || '',
        starts_at: data.starts_at,
        ends_at: data.ends_at,
        schedule_type: 'appointment',
        person_id: String(personId),
        account_id: data.account_id,
        price: data.price || 0,
        reminder: data.reminder !== false,
        sms_reminder: data.sms_reminder === true,
        metadata: {
          share_payment_link: false,
          send_payment_link: false,
        },
      },
    };

    const url = `${baseUrl(env)}/consultation_schedules`;
    const res = await fetchWithTimeout(url, {
      method: 'POST',
      headers: headers(env),
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const text = await res.text();
      return { ok: false, error: `Nimbo appointment error ${res.status}: ${text}` };
    }
    const result = await res.json();
    return { ok: true, schedule_id: result.consultation_schedule?.id || result.id };
  } catch (err) {
    return { ok: false, error: `Nimbo appointment error: ${err.message}` };
  }
}

export async function listAvailableHours(env, accountSlug, fromDate, toDate) {
  if (!accountSlug) return { ok: false, error: 'account slug requerido' };
  try {
    const url = `${baseUrl(env)}/calendar/available_hours?from=${fromDate}&to=${toDate}&monthly=false&account=${encodeURIComponent(accountSlug)}`;
    const res = await fetchWithTimeout(url, { headers: headers(env) });
    if (!res.ok) {
      const text = await res.text();
      return { ok: false, error: `Nimbo available hours error ${res.status}: ${text}` };
    }
    const data = await res.json();
    return { ok: true, hours: data.hours || [] };
  } catch (err) {
    return { ok: false, error: `Nimbo available hours error: ${err.message}` };
  }
}

export async function searchPatientByPhone(env, accountId, telephone2, bornAt) {
  if (!accountId || !telephone2) return { ok: false, error: 'account_id y telephone2 requeridos' };
  try {
    let url = `${baseUrl(env)}/accounts/${accountId}/people?telephone2=${encodeURIComponent(telephone2)}`;
    if (bornAt) url += `&born_at=${encodeURIComponent(bornAt)}`;
    const res = await fetchWithTimeout(url, { headers: headers(env) });
    if (!res.ok) {
      const text = await res.text();
      return { ok: false, error: `Nimbo search by phone error ${res.status}: ${text}` };
    }
    const data = await res.json();
    return { ok: true, accounts: data.accounts || [] };
  } catch (err) {
    return { ok: false, error: `Nimbo search by phone error: ${err.message}` };
  }
}
