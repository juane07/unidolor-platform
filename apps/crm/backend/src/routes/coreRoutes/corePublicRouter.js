const express = require('express');
const router = express.Router();
const path = require('path');
const { isPathInside } = require('../../utils/is-path-inside');
const { catchErrors } = require('@/handlers/errorHandlers');
const doctorScheduleController = require('@/controllers/appControllers/doctorScheduleController');
const appointmentController = require('@/controllers/appControllers/appointmentController');
const institutionalFAQController = require('@/controllers/coreControllers/institutionalFAQController');
const prisma = require('@/db/prisma');

router.route('/test-public').get(async (req, res) => {
  res.json({ success: true, message: 'Public test route works' });
});

router.route('/faq/categorias').get(catchErrors(institutionalFAQController.getCategorias));
router.route('/faq/search').get(catchErrors(institutionalFAQController.searchFAQ));
router.route('/faq').get(catchErrors(institutionalFAQController.listFAQ));
router.route('/faq/:id').get(catchErrors(institutionalFAQController.getFAQById));

router.route('/schedule/available').get(catchErrors(doctorScheduleController['getAvailableSlots']));

router.route('/appointment/create').post(catchErrors(async (req, res) => {
  const apiKey = req.headers['x-api-key'];
  const WEBHOOK_API_KEY = process.env.WEBHOOK_API_KEY || 'unidolor-webhook-key-2026';
  if (!apiKey || apiKey !== WEBHOOK_API_KEY) {
    return res.status(401).json({ success: false, message: 'Invalid API key' });
  }
  return appointmentController['create'](req, res);
}));

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
  const client = await prisma.client.findFirst({ where: { phone: client_phone } });
  if (!client) {
    return res.status(200).json({ success: true, result: [] });
  }
  const appointments = await prisma.appointment.findMany({
    where: {
      clientId: client.id,
      removed: false,
      status: { in: ['programada', 'pendiente'] },
    },
    include: {
      doctor: { select: { name: true, specialty: true } },
      branch: { select: { name: true } },
      opportunity: { select: { service: true, stage: true } },
    },
    orderBy: [{ date: 'asc' }, { startTime: 'asc' }],
  });
  return res.status(200).json({ success: true, result: appointments });
}));

router.route('/appointment/:id/cancel').post(catchErrors(async (req, res) => {
  const apiKey = req.headers['x-api-key'];
  const WEBHOOK_API_KEY = process.env.WEBHOOK_API_KEY || 'unidolor-webhook-key-2026';
  if (!apiKey || apiKey !== WEBHOOK_API_KEY) {
    return res.status(401).json({ success: false, message: 'Invalid API key' });
  }
  const { id } = req.params;
  const appointment = await prisma.appointment.findUnique({ where: { id } });
  if (!appointment) {
    return res.status(404).json({ success: false, message: 'Cita no encontrada' });
  }
  if (appointment.removed) {
    return res.status(400).json({ success: false, message: 'Cita ya cancelada' });
  }
  const updated = await prisma.appointment.update({
    where: { id },
    data: { removed: true, status: 'cancelada' },
  });
  return res.status(200).json({ success: true, message: 'Cita cancelada', result: updated });
}));

router.route('/appointment/:id').put(catchErrors(async (req, res) => {
  const apiKey = req.headers['x-api-key'];
  const WEBHOOK_API_KEY = process.env.WEBHOOK_API_KEY || 'unidolor-webhook-key-2026';
  if (!apiKey || apiKey !== WEBHOOK_API_KEY) {
    return res.status(401).json({ success: false, message: 'Invalid API key' });
  }
  const { id } = req.params;
  const { date, startTime, endTime } = req.body;
  const appointment = await prisma.appointment.findUnique({ where: { id } });
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
    return res.status(400).json({ success: false, message: 'Doctor sin horario para ese día' });
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
      startTime: { lt: endTime },
      endTime: { gt: startTime },
    },
  });
  if (conflicting) {
    return res.status(409).json({ success: false, message: 'Horario ocupado' });
  }
  const updated = await prisma.appointment.update({
    where: { id },
    data: { date: apptDate, startTime, endTime },
    include: {
      client: { select: { name: true, phone: true, address: true } },
      doctor: { select: { name: true, specialty: true } },
      branch: { select: { name: true } },
      opportunity: { select: { service: true } },
    },
  });
  return res.status(200).json({ success: true, result: updated });
}));

router.route('/schedule/seed-bethania').post(catchErrors(async (req, res) => {
  const apiKey = req.headers['x-api-key'];
  const WEBHOOK_API_KEY = process.env.WEBHOOK_API_KEY || 'unidolor-webhook-key-2026';
  if (!apiKey || apiKey !== WEBHOOK_API_KEY) {
    return res.status(401).json({ success: false, message: 'Invalid API key' });
  }
  return doctorScheduleController['seedBethania'](req, res);
}));

router.route('/schedule/seed-initial').post(catchErrors(async (req, res) => {
  const apiKey = req.headers['x-api-key'];
  const WEBHOOK_API_KEY = process.env.WEBHOOK_API_KEY || 'unidolor-webhook-key-2026';
  if (!apiKey || apiKey !== WEBHOOK_API_KEY) {
    return res.status(401).json({ success: false, message: 'Invalid API key' });
  }

  let bethania = await prisma.doctor.findFirst({
    where: { name: { contains: 'bethania', mode: 'insensitive' } },
  });
  if (!bethania) {
    bethania = await prisma.doctor.create({
      data: {
        name: 'Dra. Bethania Martínez',
        specialty: 'Medicina del Dolor y Cuidados Paliativos',
        phone: '809-636-3656',
        email: 'bethania@unidolor.com',
        isActive: true,
      },
    });
  }

  let santoDomingo = await prisma.branch.findFirst({
    where: { name: { contains: 'santo domingo', mode: 'insensitive' } },
  });
  if (!santoDomingo) {
    santoDomingo = await prisma.branch.create({
      data: {
        name: 'Santo Domingo - Torre Solazar',
        address: 'Ave. Gustavo Mejía Ricart No.54, Torre Solazar, Piso 3, Local 3F, Ensanche Naco',
        city: 'Santo Domingo',
        phone: '809-636-3656',
        isActive: true,
      },
    });
  }

  await prisma.doctorSchedule.deleteMany({
    where: { doctorId: bethania.id, branchId: santoDomingo.id },
  });

  const schedules = await prisma.doctorSchedule.createMany({
    data: [
      {
        doctorId: bethania.id,
        branchId: santoDomingo.id,
        dayOfWeek: 3,
        startTime: '10:30',
        endTime: '17:00',
        slotDuration: 60,
        appointmentTypes: ['primera_vez', 'seguimiento'],
        priority: 1,
      },
      {
        doctorId: bethania.id,
        branchId: santoDomingo.id,
        dayOfWeek: 4,
        startTime: '10:30',
        endTime: '17:00',
        slotDuration: 60,
        appointmentTypes: ['primera_vez', 'seguimiento'],
        priority: 1,
      },
    ],
  });

  return res.status(201).json({ success: true, result: { doctor: bethania, branch: santoDomingo, schedules }, message: 'Datos iniciales creados' });
}));

router.route('/:subPath/:directory/:file').get(function (req, res) {
  try {
    const { subPath, directory, file } = req.params;
    const decodedSubPath = decodeURIComponent(subPath);
    const decodedDirectory = decodeURIComponent(directory);
    const decodedFile = decodeURIComponent(file);
    const rootDir = path.join(__dirname, '../../public');
    const relativePath = path.join(decodedSubPath, decodedDirectory, decodedFile);
    const absolutePath = path.join(rootDir, relativePath);
    if (!isPathInside(absolutePath, rootDir)) {
      return res.status(400).json({ success: false, error: 'Invalid filepath' });
    }
    return res.sendFile(absolutePath, (error) => {
      if (error) {
        return res.status(404).json({ success: false, result: null, message: 'we could not find : ' + file });
      }
    });
  } catch (error) {
    return res.status(503).json({ success: false, result: null, message: error.message, error: error });
  }
});

module.exports = router;
