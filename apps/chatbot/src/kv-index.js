const ACTIVE_PHONES_KEY = 'active_phones:v1';

export async function addActivePhone(kv, phone) {
  if (!kv || !phone || phone === 'undefined') return;
  try {
    const current = await kv.get(ACTIVE_PHONES_KEY, 'json');
    const phones = current && Array.isArray(current.phones) ? current.phones : [];
    if (!phones.includes(phone)) {
      phones.push(phone);
      await kv.put(
        ACTIVE_PHONES_KEY,
        JSON.stringify({ phones, updatedAt: Date.now() }),
        { expirationTtl: 30 * 24 * 60 * 60 }
      );
    }
  } catch (err) {
    console.error('addActivePhone error:', err.message);
  }
}

export async function getActivePhones(kv) {
  if (!kv) return [];
  try {
    const current = await kv.get(ACTIVE_PHONES_KEY, 'json');
    return current && Array.isArray(current.phones) ? current.phones : null;
  } catch (err) {
    console.error('getActivePhones error:', err.message);
    return [];
  }
}

export async function rebuildActivePhones(kv) {
  if (!kv) return 0;
  try {
    const [convList, msgList, stateList, formList] = await Promise.all([
      kv.list({ prefix: 'conv:' }),
      kv.list({ prefix: 'msgh:' }),
      kv.list({ prefix: 'state:conv:' }),
      kv.list({ prefix: 'form:latest:' }),
    ]);
    const phones = new Set();
    for (const k of convList.keys) {
      const p = k.name.slice('conv:'.length);
      if (p && p !== 'undefined') phones.add(p);
    }
    for (const k of msgList.keys) {
      const p = k.name.slice('msgh:'.length).split(':')[0];
      if (p && p !== 'undefined') phones.add(p);
    }
    for (const k of stateList.keys) {
      const p = k.name.slice('state:conv:'.length);
      if (p && p !== 'undefined') phones.add(p);
    }
    for (const k of formList.keys) {
      const p = k.name.slice('form:latest:'.length);
      if (p && p !== 'undefined') phones.add(p);
    }
    await kv.put(
      ACTIVE_PHONES_KEY,
      JSON.stringify({ phones: [...phones], updatedAt: Date.now() }),
      { expirationTtl: 30 * 24 * 60 * 60 }
    );
    return phones.size;
  } catch (err) {
    console.error('rebuildActivePhones error:', err.message);
    return 0;
  }
}
