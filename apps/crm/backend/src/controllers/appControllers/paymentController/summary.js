const prisma = require('@/db/prisma');
const moment = require('moment');

const summary = async (req, res) => {
  let defaultType = 'month';
  const { type } = req.query;

  if (type) {
    if (['week', 'month', 'year'].includes(type)) {
      defaultType = type;
    } else {
      return res.status(400).json({
        success: false,
        result: null,
        message: 'Invalid type',
      });
    }
  }

  const result = await prisma.payment.aggregate({
    where: { removed: false },
    _count: true,
    _sum: { amount: true },
  });

  return res.status(200).json({
    success: true,
    result: {
      count: result._count || 0,
      total: result._sum?.amount || 0,
    },
    message: `Successfully fetched the summary of payment invoices for the last ${defaultType}`,
  });
};

module.exports = summary;
