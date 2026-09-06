/*
 * UNIDOLOR — Seed: Doctores + Horarios (Prisma)
 * Ejecutar: cd apps/crm/backend && node src/scripts/seed-doctors.js
 */

require('module-alias/register');
require('dotenv').config({ path: '.env' });
require('dotenv').config({ path: '.env.local' });

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const DOCTORS = [
  { name: 'Dra. María González', specialty: 'Medicina del Dolor', phone: '809-555-0001', email: 'maria.gonzalez@unidolor.com', commissionRate: 10 },
  { name: 'Dr. Carlos Pérez', specialty: 'Anestesiología', phone: '809-555-0002', email: 'carlos.perez@unidolor.com', commissionRate: 10 },
];

const SCHEDULES = [
  // Lunes a Viernes 8:00-17:00
  ...Array.from({ length: 5 }, (_, i) => ({
    dayOfWeek: i + 1, // 1=Mon ... 5=Fri
    startTime: '08:00',
    endTime: '17:00',
    slotDuration: 30,
    appointmentTypes: ['primera_vez', 'seguimiento', 'urgencia'],
  })),
  // Sábado 8:00-12:00
  {
    dayOfWeek: 6,
    startTime: '08:00',
    endTime: '12:00',
    slotDuration: 30,
    appointmentTypes: ['primera_vez', 'seguimiento'],
  },
];

async function seed() {
  try {
    await prisma.$connect();
    console.log('✅ Connected to PostgreSQL\n');

    const branch = await prisma.branch.findFirst({ where: { removed: false } });
    if (!branch) {
      console.error('❌ No branch found. Run seed.js first.');
      process.exit(1);
    }

    // Seed doctors
    let created = 0, updated = 0;
    for (const doc of DOCTORS) {
      const existing = await prisma.doctor.findFirst({ where: { email: doc.email } });
      if (existing) {
        await prisma.doctor.update({ where: { id: existing.id }, data: doc });
        updated++;
      } else {
        await prisma.doctor.create({ data: { ...doc, branchId: branch.id } });
        created++;
      }
    }
    console.log(`Doctors: ${created} created, ${updated} updated`);

    // Seed schedules for each doctor
    const doctors = await prisma.doctor.findMany({ where: { removed: false } });
    let schedulesCreated = 0, schedulesUpdated = 0;
    for (const doctor of doctors) {
      for (const sched of SCHEDULES) {
        const existing = await prisma.doctorSchedule.findFirst({
          where: { doctorId: doctor.id, dayOfWeek: sched.dayOfWeek, startTime: sched.startTime },
        });
        if (existing) {
          await prisma.doctorSchedule.update({ where: { id: existing.id }, data: sched });
          schedulesUpdated++;
        } else {
          await prisma.doctorSchedule.create({
            data: { ...sched, doctorId: doctor.id, branchId: branch.id },
          });
          schedulesCreated++;
        }
      }
    }
    console.log(`Doctor Schedules: ${schedulesCreated} created, ${schedulesUpdated} updated`);

    console.log('\n🎉 Seed completed!');
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

seed();
