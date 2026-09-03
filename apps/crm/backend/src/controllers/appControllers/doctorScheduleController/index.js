const prisma = require('@/db/prisma');
const { catchErrors } = require('@/handlers/errorHandlers');

function timeToMinutes(time) {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}

function minutesToTime(mins) {
  const h = Math.floor(mins / 60).toString().padStart(2, '0');
  const m = (mins % 60).toString().padStart(2, '0');
  return `${h}:${m}`;
}

function generateSlots(schedule, date, existingAppointments) {
  const slots = [];
  const start = timeToMinutes(schedule.startTime);
  const end = timeToMinutes(schedule.endTime);
  const duration = schedule.slotDuration;

  for (let m = start; m + duration <= end; m += duration) {
    const slotStart = minutesToTime(m);
    const slotEnd = minutesToTime(m + duration);

    const isBooked = existingAppointments.some((appt) => {
      const apptStart = timeToMinutes(appt.startTime);
      const apptEnd = timeToMinutes(appt.endTime);
      return m < apptEnd && m + duration > apptStart;
    });

    const isException = schedule.exceptions?.some((ex) => {
      const exDate = new Date(ex.date).toDateString();
      const checkDate = date.toDateString();
      return exDate === checkDate && ex.isAvailable === false;
    });

    if (!isBooked && !isException) {
      slots.push({
        start: slotStart,
        end: slotEnd,
        doctor: schedule.doctorId,
        branch: schedule.branchId,
        date: date.toISOString().split('T')[0],
      });
    }
  }
  return slots;
}

const create = catchErrors(async (req, res) => {
  const { doctor, branch, dayOfWeek, startTime, endTime, slotDuration, appointmentTypes, priority, validFrom, validUntil, exceptions } = req.body;

  if (!doctor || !branch || dayOfWeek === undefined || !startTime || !endTime) {
    return res.status(400).json({ success: false, message: 'Campos requeridos: doctor, branch, dayOfWeek, startTime, endTime' });
  }

  const schedule = await prisma.doctorSchedule.create({
    data: {
      doctorId: doctor,
      branchId: branch,
      dayOfWeek,
      startTime,
      endTime,
      slotDuration: slotDuration || 30,
      appointmentTypes: appointmentTypes || ['primera_vez', 'seguimiento'],
      priority: priority || 10,
      validFrom: validFrom ? new Date(validFrom) : null,
      validUntil: validUntil ? new Date(validUntil) : null,
      exceptions: exceptions || [],
    },
  });

  return res.status(201).json({ success: true, result: schedule });
});

const list = catchErrors(async (req, res) => {
  const { doctor, branch, isActive } = req.query;
  const filter = { removed: false };
  if (doctor) filter.doctorId = doctor;
  if (branch) filter.branchId = branch;
  if (isActive !== undefined) filter.enabled = isActive === 'true';

  const schedules = await prisma.doctorSchedule.findMany({
    where: filter,
    include: { doctor: { select: { name: true, specialty: true } }, branch: { select: { name: true } } },
    orderBy: [{ priority: 'asc' }, { dayOfWeek: 'asc' }, { startTime: 'asc' }],
  });

  return res.status(200).json({ success: true, result: schedules });
});

const read = catchErrors(async (req, res) => {
  const { id } = req.params;
  const schedule = await prisma.doctorSchedule.findUnique({
    where: { id },
    include: { doctor: { select: { name: true, specialty: true } }, branch: { select: { name: true } } },
  });
  if (!schedule) {
    return res.status(404).json({ success: false, message: 'Horario no encontrado' });
  }
  return res.status(200).json({ success: true, result: schedule });
});

const update = catchErrors(async (req, res) => {
  const { id } = req.params;
  const schedule = await prisma.doctorSchedule.update({
    where: { id },
    data: req.body,
    include: { doctor: { select: { name: true, specialty: true } }, branch: { select: { name: true } } },
  });
  if (!schedule) {
    return res.status(404).json({ success: false, message: 'Horario no encontrado' });
  }
  return res.status(200).json({ success: true, result: schedule });
});

const remove = catchErrors(async (req, res) => {
  const { id } = req.params;
  const schedule = await prisma.doctorSchedule.update({
    where: { id },
    data: { removed: true },
  });
  if (!schedule) {
    return res.status(404).json({ success: false, message: 'Horario no encontrado' });
  }
  return res.status(200).json({ success: true, message: 'Horario eliminado' });
});

const getAvailableSlots = catchErrors(async (req, res) => {
  const { doctor, branch, from, to, type, limit } = req.query;

  if (!from || !to) {
    return res.status(400).json({ success: false, message: 'Parámetros requeridos: from, to (YYYY-MM-DD)' });
  }

  const fromDate = new Date(from);
  const toDate = new Date(to);
  toDate.setHours(23, 59, 59, 999);

  if (fromDate > toDate) {
    return res.status(400).json({ success: false, message: 'Fecha from debe ser anterior a to' });
  }

  const filter = { removed: false, enabled: true };
  if (doctor) filter.doctorId = doctor;
  if (branch) filter.branchId = branch;
  if (type) filter.appointmentTypes = { has: type };

  const schedules = await prisma.doctorSchedule.findMany({
    where: filter,
    include: { doctor: { select: { name: true, specialty: true } }, branch: { select: { name: true } } },
    orderBy: { priority: 'asc' },
  });

  if (schedules.length === 0) {
    return res.status(200).json({ success: true, result: [], message: 'No hay horarios configurados' });
  }

  const appointments = await prisma.appointment.findMany({
    where: {
      removed: false,
      status: { in: ['programada', 'realizada'] },
      date: { gte: fromDate, lte: toDate },
    },
    select: { date: true, startTime: true, endTime: true, doctorId: true },
  });

  const apptsByDoctor = {};
  appointments.forEach((appt) => {
    const key = `${appt.doctorId}_${appt.date.toISOString().split('T')[0]}`;
    if (!apptsByDoctor[key]) apptsByDoctor[key] = [];
    apptsByDoctor[key].push({ startTime: appt.startTime, endTime: appt.endTime });
  });

  const allSlots = [];

  for (const schedule of schedules) {
    for (let d = new Date(fromDate); d <= toDate; d.setDate(d.getDate() + 1)) {
      if (d.getDay() !== schedule.dayOfWeek) continue;
      if (schedule.validFrom && d < new Date(schedule.validFrom)) continue;
      if (schedule.validUntil && d > new Date(schedule.validUntil)) continue;

      const existing = apptsByDoctor[`${schedule.doctorId}_${d.toISOString().split('T')[0]}`] || [];
      const slots = generateSlots(schedule, d, existing);
      allSlots.push(...slots);
    }
  }

  allSlots.sort((a, b) => {
    const dateCompare = new Date(a.date).getTime() - new Date(b.date).getTime();
    if (dateCompare !== 0) return dateCompare;
    return timeToMinutes(a.start) - timeToMinutes(b.start);
  });

  const limited = limit ? allSlots.slice(0, parseInt(limit)) : allSlots;

  return res.status(200).json({ success: true, result: limited });
});

const getAvailableForDoctor = catchErrors(async (req, res) => {
  const { doctorId } = req.params;
  req.query.doctor = doctorId;
  return getAvailableSlots(req, res);
});

const seedBethania = catchErrors(async (req, res) => {
  const bethania = await prisma.doctor.findFirst({
    where: { name: { contains: 'bethania', mode: 'insensitive' } },
  });
  if (!bethania) {
    return res.status(404).json({ success: false, message: 'Dra. Bethania no encontrada. Créela primero.' });
  }

  const santoDomingo = await prisma.branch.findFirst({
    where: { name: { contains: 'santo domingo', mode: 'insensitive' } },
  });
  if (!santoDomingo) {
    return res.status(404).json({ success: false, message: 'Sucursal Santo Domingo no encontrada. Créela primero.' });
  }

  const existing = await prisma.doctorSchedule.findMany({
    where: {
      doctorId: bethania.id,
      branchId: santoDomingo.id,
      dayOfWeek: { in: [3, 4] },
    },
  });

  if (existing.length > 0) {
    return res.status(200).json({ success: true, result: existing, message: 'Ya existen horarios para la Dra. Bethania' });
  }

  const schedules = await prisma.doctorSchedule.createMany({
    data: [
      {
        doctorId: bethania.id,
        branchId: santoDomingo.id,
        dayOfWeek: 3,
        startTime: '10:30',
        endTime: '17:00',
        slotDuration: 30,
        appointmentTypes: ['primera_vez', 'seguimiento'],
        priority: 1,
      },
      {
        doctorId: bethania.id,
        branchId: santoDomingo.id,
        dayOfWeek: 4,
        startTime: '10:30',
        endTime: '17:00',
        slotDuration: 30,
        appointmentTypes: ['primera_vez', 'seguimiento'],
        priority: 1,
      },
    ],
  });

  return res.status(201).json({ success: true, result: schedules, message: 'Horarios de la Dra. Bethania creados (miércoles y jueves 10:30am-5pm)' });
});

module.exports = {
  create,
  list,
  read,
  update,
  remove,
  getAvailableSlots,
  getAvailableForDoctor,
  seedBethania,
};
