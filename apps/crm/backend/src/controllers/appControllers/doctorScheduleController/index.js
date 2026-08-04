const mongoose = require('mongoose');
const { catchErrors } = require('@/handlers/errorHandlers');

const DoctorSchedule = mongoose.model('DoctorSchedule');
const Appointment = mongoose.model('Appointment');
const Doctor = mongoose.model('Doctor');
const Branch = mongoose.model('Branch');

const DAY_NAMES = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];

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

    const isBooked = existingAppointments.some(appt => {
      const apptStart = timeToMinutes(appt.startTime);
      const apptEnd = timeToMinutes(appt.endTime);
      return m < apptEnd && m + duration > apptStart;
    });

    const isException = schedule.exceptions?.some(ex => {
      const exDate = new Date(ex.date).toDateString();
      const checkDate = date.toDateString();
      return exDate === checkDate && ex.isAvailable === false;
    });

    if (!isBooked && !isException) {
      slots.push({
        start: slotStart,
        end: slotEnd,
        doctor: schedule.doctor,
        branch: schedule.branch,
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

  const schedule = await DoctorSchedule.create({
    doctor,
    branch,
    dayOfWeek,
    startTime,
    endTime,
    slotDuration: slotDuration || 30,
    appointmentTypes: appointmentTypes || ['primera_vez', 'seguimiento'],
    priority: priority || 10,
    validFrom: validFrom ? new Date(validFrom) : null,
    validUntil: validUntil ? new Date(validUntil) : null,
    exceptions: exceptions || [],
  });

  return res.status(201).json({ success: true, result: schedule });
});

const list = catchErrors(async (req, res) => {
  const { doctor, branch, isActive } = req.query;
  const filter = { removed: false };
  if (doctor) filter.doctor = doctor;
  if (branch) filter.branch = branch;
  if (isActive !== undefined) filter.enabled = isActive === 'true';

  const schedules = await DoctorSchedule.find(filter)
    .populate('doctor', 'name specialty')
    .populate('branch', 'name')
    .sort({ priority: 1, dayOfWeek: 1, startTime: 1 });

  return res.status(200).json({ success: true, result: schedules });
});

const read = catchErrors(async (req, res) => {
  const { id } = req.params;
  const schedule = await DoctorSchedule.findById(id)
    .populate('doctor', 'name specialty')
    .populate('branch', 'name');
  if (!schedule) {
    return res.status(404).json({ success: false, message: 'Horario no encontrado' });
  }
  return res.status(200).json({ success: true, result: schedule });
});

const update = catchErrors(async (req, res) => {
  const { id } = req.params;
  const schedule = await DoctorSchedule.findByIdAndUpdate(id, req.body, { new: true, runValidators: true })
    .populate('doctor', 'name specialty')
    .populate('branch', 'name');
  if (!schedule) {
    return res.status(404).json({ success: false, message: 'Horario no encontrado' });
  }
  return res.status(200).json({ success: true, result: schedule });
});

const remove = catchErrors(async (req, res) => {
  const { id } = req.params;
  const schedule = await DoctorSchedule.findByIdAndUpdate(id, { removed: true }, { new: true });
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
  if (doctor) filter.doctor = doctor;
  if (branch) filter.branch = branch;
  if (type) filter.appointmentTypes = type;

  const schedules = await DoctorSchedule.find(filter)
    .populate('doctor', 'name specialty')
    .populate('branch', 'name')
    .sort({ priority: 1 });

  if (schedules.length === 0) {
    return res.status(200).json({ success: true, result: [], message: 'No hay horarios configurados' });
  }

  const appointments = await Appointment.find({
    removed: false,
    status: { $in: ['programada', 'realizada'] },
    date: { $gte: fromDate, $lte: toDate },
  }).select('date startTime endTime doctor branch');

  const apptsByDoctor = {};
  appointments.forEach(appt => {
    const key = `${appt.doctor}_${appt.date.toISOString().split('T')[0]}`;
    if (!apptsByDoctor[key]) apptsByDoctor[key] = [];
    apptsByDoctor[key].push({
      startTime: appt.startTime,
      endTime: appt.endTime,
    });
  });

  const allSlots = [];

  for (const schedule of schedules) {
    for (let d = new Date(fromDate); d <= toDate; d.setDate(d.getDate() + 1)) {
      if (d.getDay() !== schedule.dayOfWeek) continue;

      if (schedule.validFrom && d < new Date(schedule.validFrom)) continue;
      if (schedule.validUntil && d > new Date(schedule.validUntil)) continue;

      const existing = apptsByDoctor[`${schedule.doctor._id}_${d.toISOString().split('T')[0]}`] || [];
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
  const { from, to, type, limit } = req.query;

  if (!from || !to) {
    return res.status(400).json({ success: false, message: 'Parámetros requeridos: from, to' });
  }

  req.query.doctor = doctorId;
  return getAvailableSlots(req, res);
});

const seedBethania = catchErrors(async (req, res) => {
  const bethania = await Doctor.findOne({ name: { $regex: /bethania/i } });
  if (!bethania) {
    return res.status(404).json({ success: false, message: 'Dra. Bethania no encontrada. Créela primero.' });
  }

  const santoDomingo = await Branch.findOne({ name: { $regex: /santo domingo/i } });
  if (!santoDomingo) {
    return res.status(404).json({ success: false, message: 'Sucursal Santo Domingo no encontrada. Créela primero.' });
  }

  const existing = await DoctorSchedule.find({
    doctor: bethania._id,
    branch: santoDomingo._id,
    dayOfWeek: { $in: [3, 4] },
  });

  if (existing.length > 0) {
    return res.status(200).json({ success: true, result: existing, message: 'Ya existen horarios para la Dra. Bethania' });
  }

  const schedules = await DoctorSchedule.create([
    {
      doctor: bethania._id,
      branch: santoDomingo._id,
      dayOfWeek: 3, // miércoles
      startTime: '10:30',
      endTime: '17:00',
      slotDuration: 30,
      appointmentTypes: ['primera_vez', 'seguimiento'],
      priority: 1,
    },
    {
      doctor: bethania._id,
      branch: santoDomingo._id,
      dayOfWeek: 4, // jueves
      startTime: '10:30',
      endTime: '17:00',
      slotDuration: 30,
      appointmentTypes: ['primera_vez', 'seguimiento'],
      priority: 1,
    },
  ]);

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