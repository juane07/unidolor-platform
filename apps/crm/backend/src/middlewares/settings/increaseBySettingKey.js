const prisma = require('@/db/prisma');

const increaseBySettingKey = async ({ settingKey }) => {
  try {
    if (!settingKey) return null;

    const result = await prisma.setting.update({
      where: { settingKey },
      data: { settingValue: { increment: 1 } },
    });

    return result || null;
  } catch {
    return null;
  }
};

module.exports = increaseBySettingKey;
