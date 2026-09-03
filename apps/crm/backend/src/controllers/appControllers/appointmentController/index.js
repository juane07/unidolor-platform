const prisma = require('@/db/prisma');
const fs = require('fs');
const { catchErrors } = require('@/handlers/errorHandlers');
const custom = require('@/controllers/pdfController');

function timeToMinutes(time) {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}

async function generateFicha(appointmentId) {
  try {
    const populated = await prisma.appointment.findUnique({
      where: { id: appointmentId },
      include: { client: true, doctor: true, branch: true, opportunity: { select: { service: true } } },
    });

    const folderPath = 'appointment';
    const fileId = 'appointment-' + appointmentId + '.pdf';
    const targetLocation = `src/public/download/${folderPath}/${fileId}`;
    const dir = targetLocation.substring(0, targetLocation.lastIndexOf('/'));
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    await new Promise((resolve) => {
      custom.generatePdf('Appointment', { filename: folderPath, format: 'A4', targetLocation }, populated, () => resolve());
      setTimeout(resolve, 20000);
    });

    await prisma.appointment.update({ where: { id: appointmentId }, data: { pdf: fileId } });
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
    prisma.client.findUnique({ where: { id: clientId } }),
    prisma.doctor.findUnique({ where: { id: doctorId } }),
    branchId ? prisma.branch.findUnique({ where: { id: branchId } }) : null,
  ]);

  if (!client) return res.status(404).json({ success: false, message: 'Cliente no encontrado' });
  if (!doctor) return res.status(404).json({ success: false, message: 'Doctor no encontrado' });
  if (branchId && !branch) return res.status(404).json({ success: false, message: 'Sucursal no encontrada' });

  const apptDate = new Date(date);
  const dayOfWeek = apptDate.getDay();

  const schedule = await prisma.doctorSchedule.findFirst({
    where: {
      removed: false,
      enabled: true,
      doctorId,
      branchId,
      dayOfWeek,
      OR: [
        { validFrom: null },
        { validFrom: { lte: apptDate } },
      ],
    },
  });

  if (!schedule) {
    return res.status(400).json({
      success: false,
      message: 'El doctor no tiene horario configurado para ese día en esa sucursal',
    });
  }

  const exception = schedule.exceptions?.find((ex) => {
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

  if (schedule.appointmentTypes && !schedule.appointmentTypes.includes(type) && type !== 'visita_domiciliaria') {
    return res.status(400).json({
      success: false,
      message: 'Tipo de cita no permitido para este horario',
    });
  }

  const dayStart = new Date(apptDate);
  dayStart.setHours(0, 0, 0, 0);
  const dayEnd = new Date(apptDate);
  dayEnd.setHours(23, 59, 59, 999);

  const conflicting = await prisma.appointment.findFirst({
    where: {
      removed: false,
      status: { in: ['programada', 'realizada'] },
      doctorId,
      date: { gte: dayStart, lte: dayEnd },
      startTime: { lt: endTime },
      endTime: { gt: startTime },
    },
  });

  if (conflicting) {
    return res.status(409).json({
      success: false,
      message: 'El horario ya está ocupado',
      conflict: {
        startTime: conflicting.startTime,
        endTime: conflicting.endTime,
        client: conflicting.clientId,
      },
    });
  }

  const appointment = await prisma.appointment.create({
    data: {
      clientId,
      doctorId,
      branchId,
      opportunityId: opportunityId || null,
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
      createdById: req.admin?.id || null,
    },
  });

  if (opportunityId) {
    await prisma.opportunity.update({
      where: { id: opportunityId },
      data: {
        stage: 'cita_programada',
        metadata: { appointmentId: appointment.id },
      },
    });
  }

  if (appointment.type === 'visita_domiciliaria') {
    generateFicha(appointment.id);
  }

  const populated = await prisma.appointment.findUnique({
    where: { id: appointment.id },
    include: {
      client: { select: { name: true, phone: true, address: true } },
      doctor: { select: { name: true, specialty: true } },
      branch: { select: { name: true } },
      opportunity: { select: { service: true } },
    },
  });

  return res.status(201).json({ success: true, result: populated });
});

const list = catchErrors(async (req, res) => {
  const { client, doctor, branch, from, to, status, type } = req.query;
  const filter = { removed: false };

  if (client) filter.clientId = client;
  if (doctor) filter.doctorId = doctor;
  if (branch) filter.branchId = branch;
  if (status) filter.status = status;
  if (type) filter.type = type;

  if (from || to) {
    filter.date = {};
    if (from) filter.date.gte = new Date(from);
    if (to) filter.date.lte = new Date(to);
  }

  const appointments = await prisma.appointment.findMany({
    where: filter,
    include: {
      client: { select: { name: true, phone: true, address: true } },
      doctor: { select: { name: true, specialty: true } },
      branch: { select: { name: true } },
      opportunity: { select: { service: true, stage: true } },
    },
    orderBy: [{ date: 'asc' }, { startTime: 'asc' }],
  });

  return res.status(200).json({ success: true, result: appointments });
});

const read = catchErrors(async (req, res) => {
  const { id } = req.params;
  const appointment = await prisma.appointment.findUnique({
    where: { id },
    include: {
      client: { select: { name: true, phone: true, address: true, email: true } },
      doctor: { select: { name: true, specialty: true, phone: true, email: true } },
      branch: { select: { name: true, address: true, phone: true } },
      opportunity: { select: { service: true, stage: true, notes: true } },
    },
  });

  if (!appointment) {
    return res.status(404).json({ success: false, message: 'Cita no encontrada' });
  }
  return res.status(200).json({ success: true, result: appointment });
});

const update = catchErrors(async (req, res) => {
  const { id } = req.params;
  const {
    status, notes, startTime, endTime, date, type,
    serviceName, policyNumber, sector, familyName,
    familyIdNumber, familyPhone, familyDomicile, familyEmail,
  } = req.body;

  const appointment = await prisma.appointment.findUnique({ where: { id } });
  if (!appointment) {
    return res.status(404).json({ success: false, message: 'Cita no encontrada' });
  }

  const updateData = {};

  if (startTime || endTime || date) {
    const apptDate = date ? new Date(date) : appointment.date;
    const sTime = startTime || appointment.startTime;
    const eTime = endTime || appointment.endTime;

    const schedule = await prisma.doctorSchedule.findFirst({
      where: {
        removed: false,
        enabled: true,
        doctorId: appointment.doctorId,
        branchId: appointment.branchId,
        dayOfWeek: apptDate.getDay(),
      },
    });

    if (!schedule) {
      return res.status(400).json({ success: false, message: 'Sin horario configurado' });
    }

    const dayStart = new Date(apptDate);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(apptDate);
    dayEnd.setHours(23, 59, 59, 999);

    const conflicting = await prisma.appointment.findFirst({
      where: {
        id: { not: id },
        removed: false,
        status: { in: ['programada', 'realizada'] },
        doctorId: appointment.doctorId,
        date: { gte: dayStart, lte: dayEnd },
        startTime: { lt: eTime },
        endTime: { gt: sTime },
      },
    });

    if (conflicting) {
      return res.status(409).json({ success: false, message: 'Horario ocupado' });
    }

    updateData.date = apptDate;
    updateData.startTime = sTime;
    updateData.endTime = eTime;
  }

  if (status) updateData.status = status;
  if (notes !== undefined) updateData.notes = notes;
  if (type) updateData.type = type;
  if (serviceName !== undefined) updateData.serviceName = serviceName;
  if (policyNumber !== undefined) updateData.policyNumber = policyNumber;
  if (sector !== undefined) updateData.sector = sector;
  if (familyName !== undefined) updateData.familyName = familyName;
  if (familyIdNumber !== undefined) updateData.familyIdNumber = familyIdNumber;
  if (familyPhone !== undefined) updateData.familyPhone = familyPhone;
  if (familyDomicile !== undefined) updateData.familyDomicile = familyDomicile;
  if (familyEmail !== undefined) updateData.familyEmail = familyEmail;

  const updated = await prisma.appointment.update({
    where: { id },
    data: updateData,
  });

  if (updated.type === 'visita_domiciliaria') {
    generateFicha(updated.id);
  }

  const populated = await prisma.appointment.findUnique({
    where: { id: updated.id },
    include: {
      client: { select: { name: true, phone: true, address: true } },
      doctor: { select: { name: true, specialty: true } },
      branch: { select: { name: true } },
      opportunity: { select: { service: true } },
    },
  });

  return res.status(200).json({ success: true, result: populated });
});

const remove = catchErrors(async (req, res) => {
  const { id } = req.params;
  const appointment = await prisma.appointment.update({
    where: { id },
    data: { removed: true, status: 'cancelada' },
  });
  if (!appointment) {
    return res.status(404).json({ success: false, message: 'Cita no encontrada' });
  }
  return res.status(200).json({ success: true, message: 'Cita cancelada' });
});

const listAll = catchErrors(async (req, res) => {
  const sort = req.query.sort || 'desc';

  const appointments = await prisma.appointment.findMany({
    where: { removed: false },
    include: {
      client: { select: { name: true, phone: true, address: true } },
      doctor: { select: { name: true, specialty: true } },
      branch: { select: { name: true } },
      opportunity: { select: { service: true, stage: true } },
    },
    orderBy: { created: sort },
  });

  return res.status(200).json({
    success: true,
    result: appointments,
    message: 'Successfully found all documents',
  });
});

module.exports = { create, list, read, update, remove, listAll };
