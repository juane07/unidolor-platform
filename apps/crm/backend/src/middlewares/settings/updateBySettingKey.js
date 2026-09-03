const prisma = require('@/db/prisma');

const updateBySettingKey = async ({ settingKey, settingValue }) => {
  try {
    if (!settingKey || !settingValue) return null;

    const result = await prisma.setting.upsert({
      where: { settingKey },
      update: { settingValue },
      create: { settingKey, settingValue, settingCategory: 'general' },
    });

    return result || null;
  } catch {
    return null;
  }
};

module.exports = updateBySettingKey;
