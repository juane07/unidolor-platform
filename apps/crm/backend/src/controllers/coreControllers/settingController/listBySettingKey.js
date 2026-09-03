const prisma = require('@/db/prisma');

const listBySettingKey = async (req, res) => {
  const settingKeyArray = req.query.settingKeyArray ? req.query.settingKeyArray.split(',') : [];

  if (settingKeyArray.length === 0) {
    return res
      .status(202)
      .json({
        success: false,
        result: [],
        message: 'Please provide settings you need',
      })
      .end();
  }

  const results = await prisma.setting.findMany({
    where: {
      settingKey: { in: settingKeyArray },
      removed: false,
    },
  });

  if (results.length >= 1) {
    return res.status(200).json({
      success: true,
      result: results,
      message: 'Successfully found all documents',
    });
  }
  return res
    .status(202)
    .json({
      success: false,
      result: [],
      message: 'No document found by this request',
    })
    .end();
};

module.exports = listBySettingKey;
