const prisma = require('@/db/prisma');

const updateManySetting = async (req, res) => {
  let settingsHasError = false;
  const { settings } = req.body;

  for (const setting of settings) {
    if (!setting.hasOwnProperty('settingKey') || !setting.hasOwnProperty('settingValue')) {
      settingsHasError = true;
      break;
    }
  }

  if (!settings || settings.length === 0) {
    return res.status(202).json({
      success: false,
      result: null,
      message: 'No settings provided ',
    });
  }

  if (settingsHasError) {
    return res.status(202).json({
      success: false,
      result: null,
      message: 'Settings provided has Error',
    });
  }

  const promises = settings.map((setting) =>
    prisma.setting.upsert({
      where: { settingKey: setting.settingKey },
      update: { settingValue: setting.settingValue },
      create: {
        settingKey: setting.settingKey,
        settingValue: setting.settingValue,
        settingCategory: setting.settingCategory || 'general',
      },
    })
  );

  const results = await Promise.all(promises);

  if (!results || results.length === 0) {
    return res.status(404).json({
      success: false,
      result: null,
      message: 'No settings found by to update',
    });
  }
  return res.status(200).json({
    success: true,
    result: [],
    message: 'we update all settings',
  });
};

module.exports = updateManySetting;
