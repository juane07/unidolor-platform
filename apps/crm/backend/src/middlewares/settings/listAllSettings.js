const prisma = require('@/db/prisma');

const listAllSettings = async () => {
  try {
    const result = await prisma.setting.findMany({
      where: { removed: false },
    });
    return result.length > 0 ? result : [];
  } catch {
    return [];
  }
};

module.exports = listAllSettings;
