const prisma = require('@/db/prisma');

const listAll = async (req, res) => {
  const sort = req.query.sort || 'desc';

  const result = await prisma.setting.findMany({
    where: { removed: false, isPrivate: false },
    orderBy: { created: sort },
  });

  if (result.length > 0) {
    return res.status(200).json({
      success: true,
      result,
      message: 'Successfully found all documents',
    });
  }
  return res.status(203).json({
    success: false,
    result: [],
    message: 'Collection is Empty',
  });
};

module.exports = listAll;
