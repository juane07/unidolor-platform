const mongoose = require('mongoose');
const { institutionalConfig } = require('@/settings');

const REQUIRED_PATIENT_FIELDS = institutionalConfig.informacionMinimaPaciente;

const handleBotWebhook = async (req, res) => {
  const WEBHOOK_API_KEY = process.env.WEBHOOK_API_KEY || 'unidolor-webhook-key-2026';

  const apiKey = req.headers['x-api-key'];
  if (!apiKey || apiKey !== WEBHOOK_API_KEY) {
    return res.status(401).json({ success: false, message: 'Invalid API key' });
  }

  const {
    nombre,
    first_name,
    last_name,
    telefono,
    cedula,
    fecha_nacimiento,
    email,
    direccion,
    servicio,
    servicioCode,
    tipoCita,
    preferredDate,
    preferredTime,
    notes,
    notas,
    seguro,
    afiliado,
    genero,
    sucursal,
    requisitos,
    fuente,
    caller_phone,
    caller_name,
    relationship,
    patient_name,
    patient_phone,
    source_channel,
  } = req.body;

  const finalNotes = notas || notes || '';

  // Validar campos obligatorios según configuración institucional
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
      requiredFields: REQUIRED_PATIENT_FIELDS
    });
  }

  const Client = mongoose.model('Client');
  const Opportunity = mongoose.model('Opportunity');
  const Appointment = mongoose.model('Appointment');

  let client = await Client.findOne({
    $or: [
      { phone: telefono },
      ...(cedula ? [{ identity_number: cedula }] : []),
    ],
  });

  if (!client) {
    client = await Client.create({
      name: nombre,
      phone: telefono,
      address: direccion || '',
      email: email || '',
      identity_number: cedula || '',
      metadata: {
        fecha_nacimiento,
        seguro,
        afiliado,
        genero,
        sucursal,
        requisitos,
        servicio,
        notas: finalNotes,
        caller_phone,
        caller_name,
        relationship: relationship || 'mismo',
        patient_name,
        patient_phone,
        source_channel: source_channel || 'whatsapp',
      },
    });
  } else {
    const updates = {};
    if (direccion && !client.address) updates.address = direccion;
    if (email && !client.email) updates.email = email;
    if (cedula && !client.identity_number) updates.identity_number = cedula;
    const metaUpdates = {};
    if (fecha_nacimiento) metaUpdates['metadata.fecha_nacimiento'] = fecha_nacimiento;
    if (seguro) metaUpdates['metadata.seguro'] = seguro;
    if (afiliado) metaUpdates['metadata.afiliado'] = afiliado;
    if (genero) metaUpdates['metadata.genero'] = genero;
    if (sucursal) metaUpdates['metadata.sucursal'] = sucursal;
    if (requisitos) metaUpdates['metadata.requisitos'] = requisitos;
    if (caller_phone) metaUpdates['metadata.caller_phone'] = caller_phone;
    if (caller_name) metaUpdates['metadata.caller_name'] = caller_name;
    if (relationship) metaUpdates['metadata.relationship'] = relationship;
    if (patient_name) metaUpdates['metadata.patient_name'] = patient_name;
    if (patient_phone) metaUpdates['metadata.patient_phone'] = patient_phone;
    if (source_channel) metaUpdates['metadata.source_channel'] = source_channel;
    Object.assign(updates, metaUpdates);
    if (Object.keys(updates).length > 0) {
      await Client.findByIdAndUpdate(client._id, { $set: updates });
    }
  }

  const recentAppointment = await Appointment.findOne({
    client: client._id,
    removed: false,
    status: { $ne: 'cancelada' },
  }).sort({ date: -1 }).limit(1);

  const isFollowUp = tipoCita === 'seguimiento' || (recentAppointment && /seguimiento|control|revisi[oó]n/.test(finalNotes));
  const finalTipoCita = isFollowUp ? 'seguimiento' : 'primera_vez';

  let opportunity = await Opportunity.findOne({
    client: client._id,
    stage: { $in: ['cotizacion', 'cita_solicitada', 'cita_programada'] },
    removed: false,
  }).sort({ created: -1 }).limit(1);

  if (!opportunity) {
    opportunity = await Opportunity.create({
      client: client._id,
      stage: 'cita_solicitada',
      service: servicio || '',
      source: fuente || 'whatsapp',
      notes: finalNotes,
      metadata: { seguro, afiliado, tipoCita: finalTipoCita, genero, sucursal, requisitos, caller_phone, caller_name, relationship: relationship || 'mismo', patient_name, patient_phone, source_channel: source_channel || 'whatsapp' },
    });
  } else {
    opportunity.stage = 'cita_solicitada';
    opportunity.service = servicio || opportunity.service;
    opportunity.notes = finalNotes || opportunity.notes;
    opportunity.metadata = { ...opportunity.metadata, seguro, afiliado, tipoCita: finalTipoCita, genero, sucursal, requisitos, caller_phone, caller_name, relationship: relationship || 'mismo', patient_name, patient_phone, source_channel: source_channel || 'whatsapp' };
    await opportunity.save();
  }

  const Notification = mongoose.model('Notification');
  await Notification.create({
    type: 'webhook_bot',
    title: `Nueva solicitud de cita: ${nombre}`,
    message: `${servicio || 'Sin servicio'} - ${finalTipoCita === 'seguimiento' ? 'Seguimiento' : 'Primera vez'}`,
    link: '/pipeline',
    modelId: opportunity._id,
  });

  return res.status(201).json({
    success: true,
    contactId: client._id,
    opportunityId: opportunity._id,
    isExistingPatient: !!recentAppointment,
    suggestedTipoCita: finalTipoCita,
    lastAppointment: recentAppointment ? {
      date: recentAppointment.date,
      doctor: recentAppointment.doctor,
      service: recentAppointment.type,
    } : null,
  });
};

module.exports = { handleBotWebhook };
