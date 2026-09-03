const prisma = require('@/db/prisma');
const moment = require('moment');

const summary = async (Model, req, res) => {
  let defaultType = 'month';
  const { type } = req.query;

  if (type && ['week', 'month', 'year'].includes(type)) {
    defaultType = type;
  } else if (type) {
    return res.status(400).json({
      success: false,
      result: null,
      message: 'Invalid type',
    });
  }

  const currentDate = moment();
  const startDate = currentDate.clone().startOf(defaultType).toDate();
  const endDate = currentDate.clone().endOf(defaultType).toDate();

  const [totalClients, newClients, activeClients] = await Promise.all([
    prisma.client.count({ where: { removed: false, isActive: true } }),
    prisma.client.count({
      where: {
        removed: false,
        isActive: true,
        created: { gte: startDate, lte: endDate },
      },
    }),
    prisma.client.count({
      where: {
        removed: false,
        isActive: true,
        invoices: { some: { removed: false } },
      },
    }),
  ]);

  const totalActiveClientsPercentage = totalClients > 0 ? (activeClients / totalClients) * 100 : 0;
  const totalNewClientsPercentage = totalClients > 0 ? (newClients / totalClients) * 100 : 0;

  return res.status(200).json({
    success: true,
    result: {
      new: Math.round(totalNewClientsPercentage),
      active: Math.round(totalActiveClientsPercentage),
    },
    message: 'Successfully get summary of new clients',
  });
};

module.exports = summary;
