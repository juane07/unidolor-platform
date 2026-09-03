require('dotenv').config({ path: '.env' });
require('dotenv').config({ path: '.env.local' });
const { globSync } = require('glob');
const fs = require('fs');
const { generate: uniqueId } = require('shortid');
const bcrypt = require('bcryptjs');
const Joi = require('joi');
const prisma = require('@/db/prisma');

const setup = async (req, res) => {
  const { name, email, password, language, timezone, country, config = {} } = req.body;

  const objectSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string()
      .email({ tlds: { allow: true } })
      .required(),
    password: Joi.string().required(),
  });

  const { error, value } = objectSchema.validate({ name, email, password });
  if (error) {
    return res.status(409).json({
      success: false,
      result: null,
      error: error,
      message: 'Invalid/Missing credentials.',
      errorMessage: error.message,
    });
  }

  const salt = uniqueId();
  const passwordHash = bcrypt.hashSync(salt + password);

  const accountOwner = await prisma.admin.create({
    data: {
      email,
      name,
      role: 'owner',
    },
  });

  await prisma.adminPassword.create({
    data: {
      password: passwordHash,
      emailVerified: true,
      salt: salt,
      adminId: accountOwner.id,
    },
  });

  const settingData = [];
  const settingsFiles = globSync('./src/setup/defaultSettings/**/*.json');

  for (const filePath of settingsFiles) {
    const file = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    const settingsToUpdate = {
      idurar_app_email: email,
      idurar_app_company_email: email,
      idurar_app_timezone: timezone,
      idurar_app_country: country,
      idurar_app_language: language || 'en_us',
    };
    const newSettings = file.map((x) => {
      const settingValue = settingsToUpdate[x.settingKey];
      return settingValue ? { ...x, settingValue } : { ...x };
    });
    settingData.push(...newSettings);
  }

  for (const setting of settingData) {
    await prisma.setting.upsert({
      where: { settingKey: setting.settingKey },
      update: { settingValue: setting.settingValue },
      create: {
        settingKey: setting.settingKey,
        settingValue: setting.settingValue,
        settingCategory: setting.settingCategory || 'general',
      },
    });
  }

  return res.status(200).json({
    success: true,
    result: {},
    message: 'Successfully IDURAR App Setup',
  });
};

module.exports = setup;
