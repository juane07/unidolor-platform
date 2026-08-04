const mongoose = require('mongoose');
const fs = require('fs');
const { catchErrors } = require('@/handlers/errorHandlers');
const custom = require('@/controllers/pdfController');

const Appointment = mongoose.model('Appointment');
const DoctorSchedule = mongoose.model('DoctorSchedule');
const Client = mongoose.model('Client');
const Doctor = mongoose.model('Doctor');
const Branch = mongoose.model('Branch');
const Opportunity = mongoose.model('Opportunity');

function timeToMinutes(time) {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}

async function generateFicha(appointmentId) {
  try {
    const populated = await Appointment.findById(appointmentId)
      .populate('client')
      .populate('doctor')
      .populate('branch')
      .populate('opportunity', 'service');

    const folderPath = 'appointment';
    const fileId = 'appointment-' + appointmentId + '.pdf';
    const targetLocation = `src/public/download/${folderPath}/${fileId}`;
    const dir = targetLocation.substring(0, targetLocation.lastIndexOf('/'));
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    await new Promise((resolve) => {
      custom.generatePdf('Appointment', { filename: folderPath, format: 'A4', targetLocation }, populated, () => resolve());
      setTimeout(resolve, 20000);
    });

    await Appointment.findByIdAndUpdate(appointmentId, { pdf: fileId });
  } catch (e) {
    console.error('Error generando ficha de atención:', e.message);
  }
}

const create = catchErrors(async (req, res) => {
  const {
    client: clientId,
    doctor: doctorId,
    branch: branchId,
    date,
    startTime,
    endTime,
    duration,
    type,
    status,
    notes,
    opportunity: opportunityId,
    serviceName,
    policyNumber,
    sector,
    familyName,
    familyIdNumber,
    familyPhone,
    familyDomicile,
    familyEmail,
  } = req.body;

  if (!clientId || !doctorId || !date || !startTime || !endTime) {
    return res.status(400).json({
      success: false,
      message: 'Campos requeridos: client, doctor, date, startTime, endTime',
    });
  }

  const [client, doctor, branch] = await Promise.all([
    Client.findById(clientId),
    Doctor.findById(doctorId),
    Branch.findById(branchId),
  ]);

  if (!client) return res.status(404).json({ success: false, message: 'Cliente no encontrado' });
  if (!doctor) return res.status(404).json({ success: false, message: 'Doctor no encontrado' });
  if (!branch) return res.status(404).json({ success: false, message: 'Sucursal no encontrada' });

  const apptDate = new Date(date);
  const dayOfWeek = apptDate.getDay();

  const schedule = await DoctorSchedule.findOne({
    removed: false,
    enabled: true,
    doctor: doctorId,
    branch: branchId,
    dayOfWeek,
    $or: [
      { validFrom: { $exists: false } },
      { validFrom: { $lte: apptDate } },
    ],
    $or: [
      { validUntil: { $exists: false } },
      { validUntil: { $gte: apptDate } },
    ],
  });

  if (!schedule) {
    return res.status(400).json({
      success: false,
      message: 'El doctor no tiene horario configurado para ese día en esa sucursal',
    });
  }

  const exception = schedule.exceptions?.find(ex => {
    const exDate = new Date(ex.date).toDateString();
    return exDate === apptDate.toDateString() && ex.isAvailable === false;
  });

  if (exception) {
    return res.status(400).json({
      success: false,
      message: `Horario no disponible: ${exception.reason || 'Excepción en agenda'}`,
    });
  }

  const scheduleStart = timeToMinutes(schedule.startTime);
  const scheduleEnd = timeToMinutes(schedule.endTime);
  const requestedStart = timeToMinutes(startTime);
  const requestedEnd = timeToMinutes(endTime);

  if (requestedStart < scheduleStart || requestedEnd > scheduleEnd) {
    return res.status(400).json({
      success: false,
      message: `Horario fuera del rango del doctor (${schedule.startTime} - ${schedule.endTime})`,
    });
  }

  if ((requestedEnd - requestedStart) % schedule.slotDuration !== 0) {
    return res.status(400).json({
      success: false,
      message: `La duración debe ser múltiplo de ${schedule.slotDuration} minutos`,
    });
  }

  if (
    schedule.appointmentTypes &&
    !schedule.appointmentTypes.includes(type) &&
    type !== 'visita_domiciliaria'
  ) {
    return res.status(400).json({
      success: false,
      message: `Tipo de cita no permitido para este horario`,
    });
  }

  const dayStart = new Date(apptDate);
  dayStart.setHours(0, 0, 0, 0);
  const dayEnd = new Date(apptDate);
  dayEnd.setHours(23, 59, 59, 999);

  const conflicting = await Appointment.findOne({
    removed: false,
    status: { $in: ['programada', 'realizada'] },
    doctor: doctorId,
    date: {
      $gte: dayStart,
      $lte: dayEnd,
    },
    $or: [
      { startTime: { $lt: endTime }, endTime: { $gt: startTime } },
    ],
  });

  if (conflicting) {
    return res.status(409).json({
      success: false,
      message: 'El horario ya está ocupado',
      conflict: {
        startTime: conflicting.startTime,
        endTime: conflicting.endTime,
        client: conflicting.client,
      },
    });
  }

  const appointment = await Appointment.create({
    client: clientId,
    doctor: doctorId,
    branch: branchId,
    opportunity: opportunityId || null,
    date: apptDate,
    startTime,
    endTime,
    duration: duration || (timeToMinutes(endTime) - timeToMinutes(startTime)),
    type: type || 'primera_vez',
    status: status || 'programada',
    notes: notes || '',
    serviceName: serviceName || '',
    policyNumber: policyNumber || '',
    sector: sector || '',
    familyName: familyName || '',
    familyIdNumber: familyIdNumber || '',
    familyPhone: familyPhone || '',
    familyDomicile: familyDomicile || '',
    familyEmail: familyEmail || '',
    createdBy: req.admin?._id || null,
  });

  if (opportunityId) {
    await Opportunity.findByIdAndUpdate(opportunityId, {
      stage: 'cita_programada',
      $set: { 'metadata.appointmentId': appointment._id },
    });
  }

  if (appointment.type === 'visita_domiciliaria') {
    generateFicha(appointment._id);
  }

  const populated = await Appointment.findById(appointment._id)
    .populate('client', 'name phone address')
    .populate('doctor', 'name specialty')
    .populate('branch', 'name')
    .populate('opportunity', 'service');

  return res.status(201).json({ success: true, result: populated });
});

const list = catchErrors(async (req, res) => {
  const { client, doctor, branch, from, to, status, type } = req.query;
  const filter = { removed: false };

  if (client) filter.client = client;
  if (doctor) filter.doctor = doctor;
  if (branch) filter.branch = branch;
  if (status) filter.status = status;
  if (type) filter.type = type;

  if (from || to) {
    filter.date = {};
    if (from) filter.date.$gte = new Date(from);
    if (to) filter.date.$lte = new Date(to);
  }

  const appointments = await Appointment.find(filter)
    .populate('client', 'name phone address')
    .populate('doctor', 'name specialty')
    .populate('branch', 'name')
    .populate('opportunity', 'service stage')
    .sort({ date: 1, startTime: 1 });

  return res.status(200).json({ success: true, result: appointments });
});

const read = catchErrors(async (req, res) => {
  const { id } = req.params;
  const appointment = await Appointment.findById(id)
    .populate('client', 'name phone address email')
    .populate('doctor', 'name specialty phone email')
    .populate('branch', 'name address phone')
    .populate('opportunity', 'service stage notes');

  if (!appointment) {
    return res.status(404).json({ success: false, message: 'Cita no encontrada' });
  }
  return res.status(200).json({ success: true, result: appointment });
});

const update = catchErrors(async (req, res) => {
  const { id } = req.params;
  const {
    status,
    notes,
    startTime,
    endTime,
    date,
    type,
    serviceName,
    policyNumber,
    sector,
    familyName,
    familyIdNumber,
    familyPhone,
    familyDomicile,
    familyEmail,
  } = req.body;

  const appointment = await Appointment.findById(id);
  if (!appointment) {
    return res.status(404).json({ success: false, message: 'Cita no encontrada' });
  }

  if (startTime || endTime || date) {
    const apptDate = date ? new Date(date) : appointment.date;
    const sTime = startTime || appointment.startTime;
    const eTime = endTime || appointment.endTime;

    const schedule = await DoctorSchedule.findOne({
      removed: false,
      enabled: true,
      doctor: appointment.doctor,
      branch: appointment.branch,
      dayOfWeek: apptDate.getDay(),
    });

    if (!schedule) {
      return res.status(400).json({ success: false, message: 'Sin horario configurado' });
    }

    const dayStart = new Date(apptDate);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(apptDate);
    dayEnd.setHours(23, 59, 59, 999);

    const conflicting = await Appointment.findOne({
      _id: { $ne: id },
      removed: false,
      status: { $in: ['programada', 'realizada'] },
      doctor: appointment.doctor,
      date: {
        $gte: dayStart,
        $lte: dayEnd,
      },
      $or: [{ startTime: { $lt: eTime }, endTime: { $gt: sTime } }],
    });

    if (conflicting) {
      return res.status(409).json({ success: false, message: 'Horario ocupado' });
    }

    appointment.date = apptDate;
    appointment.startTime = sTime;
    appointment.endTime = eTime;
  }

  if (status) appointment.status = status;
  if (notes !== undefined) appointment.notes = notes;
  if (type) appointment.type = type;
  if (serviceName !== undefined) appointment.serviceName = serviceName;
  if (policyNumber !== undefined) appointment.policyNumber = policyNumber;
  if (sector !== undefined) appointment.sector = sector;
  if (familyName !== undefined) appointment.familyName = familyName;
  if (familyIdNumber !== undefined) appointment.familyIdNumber = familyIdNumber;
  if (familyPhone !== undefined) appointment.familyPhone = familyPhone;
  if (familyDomicile !== undefined) appointment.familyDomicile = familyDomicile;
  if (familyEmail !== undefined) appointment.familyEmail = familyEmail;

  await appointment.save();

  if (appointment.type === 'visita_domiciliaria') {
    generateFicha(appointment._id);
  }

  const populated = await Appointment.findById(appointment._id)
    .populate('client', 'name phone address')
    .populate('doctor', 'name specialty')
    .populate('branch', 'name')
    .populate('opportunity', 'service');

  return res.status(200).json({ success: true, result: populated });
});

const remove = catchErrors(async (req, res) => {
  const { id } = req.params;
  const appointment = await Appointment.findByIdAndUpdate(id, { removed: true, status: 'cancelada' }, { new: true });
  if (!appointment) {
    return res.status(404).json({ success: false, message: 'Cita no encontrada' });
  }
  return res.status(200).json({ success: true, message: 'Cita cancelada' });
});

const listAll = catchErrors(async (req, res) => {
  const sort = req.query.sort || 'desc';

  const appointments = await Appointment.find({
    removed: false,
  })
    .populate('client', 'name phone address')
    .populate('doctor', 'name specialty')
    .populate('branch', 'name')
    .populate('opportunity', 'service stage')
    .sort({ created: sort });

  return res.status(200).json({
    success: true,
    result: appointments,
    message: 'Successfully found all documents',
  });
});

module.exports = { create, list, read, update, remove, listAll };