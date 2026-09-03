const prisma = require('@/db/prisma');

const listBySettingKey = async ({ settingKeyArray = [] }) => {
  try {
    if (settingKeyArray.length === 0) return [];

    const results = await prisma.setting.findMany({
      where: {
        settingKey: { in: settingKeyArray },
        removed: false,
      },
    });

    return results.length >= 1 ? results : [];
  } catch {
    return [];
  }
};

module.exports = listBySettingKey;
