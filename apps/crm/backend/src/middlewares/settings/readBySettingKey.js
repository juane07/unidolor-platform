const prisma = require('@/db/prisma');

const readBySettingKey = async ({ settingKey }) => {
  try {
    if (!settingKey) return null;

    const result = await prisma.setting.findUnique({
      where: { settingKey },
    });

    return result || null;
  } catch {
    return null;
  }
};

module.exports = readBySettingKey;
