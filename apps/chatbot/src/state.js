const conversations = new Map();
const CONV_TIMEOUT = 30 * 60 * 1000;
const IMAGES_TIMEOUT = 10 * 60 * 1000;
const APPOINTMENT_TIMEOUT = 15 * 60 * 1000;

export const modelState = {
  current: 0,
  exhausted: {},
};

export function cleanup() {
  const now = Date.now();
  for (const [k, v] of conversations) {
    if (now - v.startedAt > CONV_TIMEOUT) conversations.delete(k);
  }
}

export function getHistory(from, maxTurns = 20) {
  const conv = conversations.get(from);
  if (!conv) return [];
  return conv.history.slice(-maxTurns);
}

export function addToHistory(from, role, content) {
  if (!conversations.has(from)) {
    conversations.set(from, { history: [], startedAt: Date.now() });
  }
  conversations.get(from).history.push({ role, content });
  conversations.get(from).startedAt = Date.now();
}

export function getConvState(from) {
  if (!conversations.has(from)) {
    conversations.set(from, { history: [], startedAt: Date.now(), formData: {} });
  }
  return conversations.get(from);
}

export function setFormData(from, formData) {
  const state = getConvState(from);
  state.formData = { ...state.formData, ...formData };
}

export function getFormData(from) {
  return getConvState(from).formData || {};
}

export function setAwaitingImages(from, awaiting) {
  const state = getConvState(from);
  state.awaitingImages = { ...state.awaitingImages, ...awaiting };
  state.imagesTimeoutAt = Date.now() + IMAGES_TIMEOUT;
}

export function addReceivedImage(from, tipo, imageData) {
  const state = getConvState(from);
  if (!state.receivedImages) state.receivedImages = {};
  state.receivedImages[tipo] = imageData;
  if (state.awaitingImages) {
    state.awaitingImages[tipo] = false;
  }
  if (!state.awaitingImages?.cedula && !state.awaitingImages?.seguro) {
    state.imagesTimeoutAt = null;
  }
}

export function checkStillAwaiting(from) {
  const state = getConvState(from);
  if (!state.awaitingImages) return { cedula: false, seguro: false };
  return {
    cedula: state.awaitingImages.cedula === true,
    seguro: state.awaitingImages.seguro === true
  };
}

export function clearImagesState(from) {
  const state = getConvState(from);
  state.awaitingImages = null;
  state.imagesTimeoutAt = null;
}

export function hasImagesTimeoutExpired(from) {
  const state = getConvState(from);
  return state.imagesTimeoutAt && Date.now() > state.imagesTimeoutAt;
}

export function setAwaitingAppointment(from, data) {
  const state = getConvState(from);
  state.awaitingAppointment = { ...state.awaitingAppointment, ...data };
  state.appointmentTimeoutAt = Date.now() + APPOINTMENT_TIMEOUT;
}

export function addAppointmentSlot(from, slot) {
  const state = getConvState(from);
  state.awaitingAppointment = { ...state.awaitingAppointment, selectedSlot: slot };
  state.appointmentTimeoutAt = null;
}

export function checkAwaitingAppointment(from) {
  const state = getConvState(from);
  return state.awaitingAppointment || null;
}

export function clearAppointmentState(from) {
  const state = getConvState(from);
  state.awaitingAppointment = null;
  state.appointmentTimeoutAt = null;
}

export function hasAppointmentTimeoutExpired(from) {
  const state = getConvState(from);
  return state.appointmentTimeoutAt && Date.now() > state.appointmentTimeoutAt;
}

export function setAwaitingCancelConfirmation(from, data) {
  const state = getConvState(from);
  state.awaitingCancelConfirmation = { ...state.awaitingCancelConfirmation, ...data };
}

export function getAwaitingCancelConfirmation(from) {
  const state = getConvState(from);
  return state.awaitingCancelConfirmation || null;
}

export function clearCancelConfirmation(from) {
  const state = getConvState(from);
  state.awaitingCancelConfirmation = null;
}

export function setAwaitingRescheduleDate(from, appointmentId) {
  const state = getConvState(from);
  state.awaitingRescheduleDate = { appointmentId };
}

export function getAwaitingRescheduleDate(from) {
  const state = getConvState(from);
  return state.awaitingRescheduleDate || null;
}

export function clearRescheduleDate(from) {
  const state = getConvState(from);
  state.awaitingRescheduleDate = null;
}

export async function loadConvHistory(from, kv) {
  if (!kv) return;
  try {
    const [listResult, modelData, stateData, convData] = await Promise.all([
      kv.list({ prefix: `msgh:${from}:` }),
      kv.get('state:model', 'json'),
      kv.get(`state:conv:${from}`, 'json'),
      kv.get(`conv:${from}`, 'json'),
    ]);
    let finalState = stateData;
    let entries = [];
    let persisted = 0;

    if (convData?.messages?.length) {
      entries = convData.messages.map(m => ({ role: m.role, content: m.content }));
      persisted = entries.length;
      console.log('loadConvHistory: using conv: key, entries:', entries.length);
    } else {
      let listKeys = listResult.keys;
      if (listKeys.length > 0 && !finalState) {
        for (let i = 0; i < 3; i++) {
          await new Promise(r => setTimeout(r, 250));
          finalState = await kv.get(`state:conv:${from}`, 'json');
          if (finalState) break;
        }
      }
      for (const k of listKeys) {
        const v = await kv.get(k.name, 'json');
        if (v && v.role) entries.push({ role: v.role, content: v.content });
      }
      persisted = entries.length;
      console.log('loadConvHistory: using msgh: keys, entries:', entries.length);
    }

    conversations.set(from, {
      history: entries,
      startedAt: entries[0]?.ts || Date.now(),
      _persisted: persisted,
      formData: finalState?.formData || {},
      awaitingImages: finalState?.awaitingImages || null,
      receivedImages: finalState?.receivedImages || null,
      imagesTimeoutAt: finalState?.imagesTimeoutAt || null,
      awaitingAppointment: finalState?.awaitingAppointment || null,
      appointmentTimeoutAt: finalState?.appointmentTimeoutAt || null,
      awaitingCancelConfirmation: finalState?.awaitingCancelConfirmation || null,
      awaitingRescheduleDate: finalState?.awaitingRescheduleDate || null,
    });
    if (modelData) Object.assign(modelState, modelData);
  } catch (err) {
    console.error('KV load error:', err);
  }
}

export async function saveConvHistory(from, kv) {
  if (!kv) return;
  try {
    const conv = conversations.get(from);
    if (!conv) return;
    const pending = conv.history.slice(conv._persisted || 0);
    const now = Date.now();
    for (let i = 0; i < pending.length; i++) {
      const msg = pending[i];
      const ts = now + i;
      const key = `msgh:${from}:${ts.toString().padStart(16, '0')}:${Math.random().toString(36).slice(2, 8)}`;
      await kv.put(key, JSON.stringify({ role: msg.role, content: msg.content, ts }), { expirationTtl: 86400 });
    }
    conv._persisted = conv.history.length;
    await kv.put('state:model', JSON.stringify(modelState));
    const statePayload = {
      formData: conv.formData,
      awaitingImages: conv.awaitingImages,
      receivedImages: conv.receivedImages,
      imagesTimeoutAt: conv.imagesTimeoutAt,
      awaitingAppointment: conv.awaitingAppointment,
      appointmentTimeoutAt: conv.appointmentTimeoutAt,
      awaitingCancelConfirmation: conv.awaitingCancelConfirmation,
      awaitingRescheduleDate: conv.awaitingRescheduleDate,
    };
    await kv.put(`state:conv:${from}`, JSON.stringify(statePayload), { expirationTtl: 86400 });
    await kv.put(`conv:${from}`, JSON.stringify({
      phone: from,
      messages: conv.history.map(m => ({ role: m.role, content: m.content, timestamp: new Date().toISOString() })),
      createdAt: new Date(conv.startedAt).toISOString(),
      updatedAt: new Date().toISOString(),
    }), { expirationTtl: 604800 });
  } catch (err) {
    console.error('KV save error:', err);
  }
}