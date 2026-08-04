const express = require('express');
const router = express.Router();

const path = require('path');
const { isPathInside } = require('../../utils/is-path-inside');
const { catchErrors } = require('@/handlers/errorHandlers');
const doctorScheduleController = require('@/controllers/appControllers/doctorScheduleController');
const appointmentController = require('@/controllers/appControllers/appointmentController');
const institutionalFAQController = require('@/controllers/coreControllers/institutionalFAQController');
const mongoose = require('mongoose');

// TEST ROUTE - no auth
router.route('/test-public').get(async (req, res) => {
  res.json({ success: true, message: 'Public test route works' });
});

// Public endpoints for bot to query institutional FAQ (canonical answers)
router.route('/faq/categorias').get(catchErrors(institutionalFAQController.getCategorias));
router.route('/faq/search').get(catchErrors(institutionalFAQController.searchFAQ));
router.route('/faq').get(catchErrors(institutionalFAQController.listFAQ));
router.route('/faq/:id').get(catchErrors(institutionalFAQController.getFAQById));

// Public endpoint for bot to check availability
router.route('/schedule/available').get(catchErrors(doctorScheduleController['getAvailableSlots']));

// Public endpoint for bot to create appointments (protected by API key)
router.route('/appointment/create').post(catchErrors(async (req, res) => {
  const apiKey = req.headers['x-api-key'];
  const WEBHOOK_API_KEY = process.env.WEBHOOK_API_KEY || 'unidolor-webhook-key-2026';
  if (!apiKey || apiKey !== WEBHOOK_API_KEY) {
    return res.status(401).json({ success: false, message: 'Invalid API key' });
  }
  return appointmentController['create'](req, res);
}));

// Public endpoint for bot to list active appointments by client phone (protected by API key)
router.route('/appointment').get(catchErrors(async (req, res) => {
  const apiKey = req.headers['x-api-key'];
  const WEBHOOK_API_KEY = process.env.WEBHOOK_API_KEY || 'unidolor-webhook-key-2026';
  if (!apiKey || apiKey !== WEBHOOK_API_KEY) {
    return res.status(401).json({ success: false, message: 'Invalid API key' });
  }
  const { client_phone } = req.query;
  if (!client_phone) {
    return res.status(400).json({ success: false, message: 'client_phone is required' });
  }
  const Client = mongoose.model('Client');
  const Appointment = mongoose.model('Appointment');
  const client = await Client.findOne({ phone: client_phone });
  if (!client) {
    return res.status(200).json({ success: true, result: [] });
  }
  const appointments = await Appointment.find({
    client: client._id,
    removed: false,
    status: { $in: ['programada', 'pendiente'] },
  })
    .populate('doctor', 'name specialty')
    .populate('branch', 'name')
    .populate('opportunity', 'service stage')
    .sort({ date: 1, startTime: 1 });
  return res.status(200).json({ success: true, result: appointments });
}));

// Public endpoint for bot to cancel an appointment (protected by API key)
router.route('/appointment/:id/cancel').post(catchErrors(async (req, res) => {
  const apiKey = req.headers['x-api-key'];
  const WEBHOOK_API_KEY = process.env.WEBHOOK_API_KEY || 'unidolor-webhook-key-2026';
  if (!apiKey || apiKey !== WEBHOOK_API_KEY) {
    return res.status(401).json({ success: false, message: 'Invalid API key' });
  }
  const { id } = req.params;
  const Appointment = mongoose.model('Appointment');
  const appointment = await Appointment.findById(id);
  if (!appointment) {
    return res.status(404).json({ success: false, message: 'Cita no encontrada' });
  }
  if (appointment.removed) {
    return res.status(400).json({ success: false, message: 'Cita ya cancelada' });
  }
  appointment.removed = true;
  appointment.status = 'cancelada';
  await appointment.save();
  return res.status(200).json({ success: true, message: 'Cita cancelada', result: appointment });
}));

// Public endpoint for bot to reschedule an appointment (protected by API key)
router.route('/appointment/:id').put(catchErrors(async (req, res) => {
  const apiKey = req.headers['x-api-key'];
  const WEBHOOK_API_KEY = process.env.WEBHOOK_API_KEY || 'unidolor-webhook-key-2026';
  if (!apiKey || apiKey !== WEBHOOK_API_KEY) {
    return res.status(401).json({ success: false, message: 'Invalid API key' });
  }
  const { id } = req.params;
  const { date, startTime, endTime } = req.body;
  const Appointment = mongoose.model('Appointment');
  const DoctorSchedule = mongoose.model('DoctorSchedule');
  const appointment = await Appointment.findById(id);
  if (!appointment) {
    return res.status(404).json({ success: false, message: 'Cita no encontrada' });
  }
  if (appointment.removed) {
    return res.status(400).json({ success: false, message: 'Cita ya fue cancelada' });
  }
  if (!date || !startTime || !endTime) {
    return res.status(400).json({ success: false, message: 'date, startTime, endTime are required' });
  }
  const apptDate = new Date(date);
  const schedule = await DoctorSchedule.findOne({
    removed: false,
    enabled: true,
    doctor: appointment.doctor,
    branch: appointment.branch,
    dayOfWeek: apptDate.getDay(),
  });
  if (!schedule) {
    return res.status(400).json({ success: false, message: 'Doctor sin horario para ese día' });
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
    $or: [{ startTime: { $lt: endTime }, endTime: { $gt: startTime } }],
  });
  if (conflicting) {
    return res.status(409).json({ success: false, message: 'Horario ocupado' });
  }
  appointment.date = apptDate;
  appointment.startTime = startTime;
  appointment.endTime = endTime;
  await appointment.save();
  const populated = await Appointment.findById(appointment._id)
    .populate('client', 'name phone address')
    .populate('doctor', 'name specialty')
    .populate('branch', 'name')
    .populate('opportunity', 'service');
  return res.status(200).json({ success: true, result: populated });
}));


// Public endpoint to seed Dra. Bethania schedule (protected by API key)
router.route('/schedule/seed-bethania').post(catchErrors(async (req, res) => {
  const apiKey = req.headers['x-api-key'];
  const WEBHOOK_API_KEY = process.env.WEBHOOK_API_KEY || 'unidolor-webhook-key-2026';
  if (!apiKey || apiKey !== WEBHOOK_API_KEY) {
    return res.status(401).json({ success: false, message: 'Invalid API key' });
  }
  return doctorScheduleController['seedBethania'](req, res);
}));

// Public endpoint to seed initial data: Doctor, Branch, Schedule
router.route('/schedule/seed-initial').post(catchErrors(async (req, res) => {
  const apiKey = req.headers['x-api-key'];
  const WEBHOOK_API_KEY = process.env.WEBHOOK_API_KEY || 'unidolor-webhook-key-2026';
  if (!apiKey || apiKey !== WEBHOOK_API_KEY) {
    return res.status(401).json({ success: false, message: 'Invalid API key' });
  }

  const Doctor = mongoose.model('Doctor');
  const Branch = mongoose.model('Branch');
  const DoctorSchedule = mongoose.model('DoctorSchedule');

  let bethania = await Doctor.findOne({ name: { $regex: /bethania/i } });
  if (!bethania) {
    bethania = await Doctor.create({
      name: 'Dra. Bethania Martínez',
      specialty: 'Medicina del Dolor y Cuidados Paliativos',
      phone: '809-636-3656',
      email: 'bethania@unidolor.com',
      isActive: true,
    });
  }

  let santoDomingo = await Branch.findOne({ name: { $regex: /santo domingo/i } });
  if (!santoDomingo) {
    santoDomingo = await Branch.create({
      name: 'Santo Domingo - Torre Solazar',
      address: 'Ave. Gustavo Mejía Ricart No.54, Torre Solazar, Piso 3, Local 3F, Ensanche Naco',
      city: 'Santo Domingo',
      phone: '809-636-3656',
      isActive: true,
    });
  }

  // Delete existing schedules for this doctor/branch to allow reseed
  await DoctorSchedule.deleteMany({
    doctor: bethania._id,
    branch: santoDomingo._id,
  });

  const schedules = await DoctorSchedule.create([
    {
      doctor: bethania._id,
      branch: santoDomingo._id,
      dayOfWeek: 3, // miércoles
      startTime: '10:30',
      endTime: '17:00',
      slotDuration: 60,
      appointmentTypes: ['primera_vez', 'seguimiento'],
      priority: 1,
    },
    {
      doctor: bethania._id,
      branch: santoDomingo._id,
      dayOfWeek: 4, // jueves
      startTime: '10:30',
      endTime: '17:00',
      slotDuration: 60,
      appointmentTypes: ['primera_vez', 'seguimiento'],
      priority: 1,
    },
  ]);

  return res.status(201).json({ success: true, result: { doctor: bethania, branch: santoDomingo, schedules }, message: 'Datos iniciales creados: Dra. Bethania, Sucursal Santo Domingo, horarios miércoles y jueves 10:30am-5pm' });
}));

router.route('/:subPath/:directory/:file').get(function (req, res) {
  try {
    const { subPath, directory, file } = req.params;

    // Decode each parameter separately
    const decodedSubPath = decodeURIComponent(subPath);
    const decodedDirectory = decodeURIComponent(directory);
    const decodedFile = decodeURIComponent(file);

    // Define the trusted root directory
    const rootDir = path.join(__dirname, '../../public');

    // Safely join the decoded path segments
    const relativePath = path.join(decodedSubPath, decodedDirectory, decodedFile);
    const absolutePath = path.join(rootDir, relativePath);

    // Check if the resulting path stays inside rootDir
    if (!isPathInside(absolutePath, rootDir)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid filepath',
      });
    }

    return res.sendFile(absolutePath, (error) => {
      if (error) {
        return res.status(404).json({
          success: false,
          result: null,
          message: 'we could not find : ' + file,
        });
      }
    });
  } catch (error) {
    return res.status(503).json({
      success: false,
      result: null,
      message: error.message,
      error: error,
    });
  }
});

module.exports = router;
