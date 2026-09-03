require('module-alias/register');
require('dotenv').config({ path: '.env' });
require('dotenv').config({ path: '.env.local' });

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const { generate: uniqueId } = require('shortid');

const prisma = new PrismaClient();

async function seed() {
  try {
    await prisma.$connect();
    console.log('✅ Connected to PostgreSQL');

    // 1. Create admin user
    const existingAdmin = await prisma.admin.findFirst({ where: { email: 'admin@admin.com' } });
    if (!existingAdmin) {
      const salt = uniqueId();
      const passwordHash = bcrypt.hashSync(salt + 'admin123');

      const admin = await prisma.admin.create({
        data: {
          email: 'admin@admin.com',
          name: 'Admin Unidolor',
          role: 'admin',
          isActive: true,
        },
      });

      await prisma.adminPassword.create({
        data: {
          password: passwordHash,
          salt: salt,
          emailVerified: true,
          adminId: admin.id,
        },
      });

      console.log('✅ Admin user created: admin@admin.com / admin123');
    } else {
      console.log('ℹ️  Admin user already exists');
    }

    // 2. Create default branch
    const existingBranch = await prisma.branch.findFirst({ where: { removed: false } });
    if (!existingBranch) {
      await prisma.branch.create({
        data: {
          name: 'Santo Domingo - Torre Solazar',
          address: 'Ave. Gustavo Mejía Ricart No.54, Torre Solazar, Piso 3, Local 3F, Ensanche Naco',
          city: 'Santo Domingo',
          phone: '809-636-3656',
          contactPerson: 'Admin',
          isActive: true,
        },
      });
      console.log('✅ Default branch created');
    } else {
      console.log('ℹ️  Branch already exists');
    }

    // 3. Create NCF sequences
    const branch = await prisma.branch.findFirst({ where: { removed: false } });
    const existingNcf = await prisma.ncfSequence.findFirst({ where: { removed: false } });
    if (!existingNcf) {
      const defaults = [
        { tipo: '01', nombre: 'Factura de crédito fiscal', regimen: 'RST', rangoDesde: 10000001, rangoHasta: 10010000 },
        { tipo: '02', nombre: 'Factura de consumo', regimen: 'RST', rangoDesde: 10000001, rangoHasta: 10010000 },
        { tipo: '03', nombre: 'Nota de débito', regimen: 'RST', rangoDesde: 10000001, rangoHasta: 10010000 },
        { tipo: '04', nombre: 'Nota de crédito', regimen: 'RST', rangoDesde: 10000001, rangoHasta: 10010000 },
        { tipo: '11', nombre: 'Régimen especial (e-CF)', regimen: 'RST', rangoDesde: 10000001, rangoHasta: 10010000 },
      ];

      for (const d of defaults) {
        await prisma.ncfSequence.create({
          data: {
            ...d,
            branch: branch ? { connect: { id: branch.id } } : undefined,
            isActive: true,
            secuenciaActual: d.rangoDesde - 1,
          },
        });
      }
      console.log('✅ NCF sequences created (types 01-04, 11)');
    } else {
      console.log('ℹ️  NCF sequences already exist');
    }

    // 4. Create default settings
    const existingSetting = await prisma.setting.findFirst({ where: { removed: false } });
    if (!existingSetting) {
      const defaultSettings = [
        { settingKey: 'idurar_app_email', settingValue: 'admin@admin.com', settingCategory: 'app' },
        { settingKey: 'idurar_app_company_name', settingValue: 'Unidolor', settingCategory: 'app' },
        { settingKey: 'idurar_app_timezone', settingValue: 'America/Santo_Domingo', settingCategory: 'app' },
        { settingKey: 'idurar_app_country', settingValue: 'DO', settingCategory: 'app' },
        { settingKey: 'idurar_app_language', settingValue: 'es_do', settingCategory: 'app' },
        { settingKey: 'last_invoice_number', settingValue: 0, settingCategory: 'invoice' },
      ];

      for (const s of defaultSettings) {
        await prisma.setting.create({ data: s });
      }
      console.log('✅ Default settings created');
    } else {
      console.log('ℹ️  Settings already exist');
    }

    console.log('\n🎉 Seed completed successfully!');
  } catch (error) {
    console.error('❌ Seed error:', error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

seed();
