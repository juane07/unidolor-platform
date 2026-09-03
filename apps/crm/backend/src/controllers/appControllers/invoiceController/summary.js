const prisma = require('@/db/prisma');
const moment = require('moment');
const { loadSettings } = require('@/middlewares/settings');

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

  const statuses = ['draft', 'pending', 'overdue', 'paid', 'unpaid', 'partially'];

  const [totalInvoice, statusCounts, paymentStatusCounts, overdueCounts, unpaid] = await Promise.all([
    prisma.invoice.aggregate({
      where: { removed: false },
      _sum: { total: true },
      _count: true,
    }),
    prisma.invoice.groupBy({
      by: ['status'],
      where: { removed: false },
      _count: true,
    }),
    prisma.invoice.groupBy({
      by: ['paymentStatus'],
      where: { removed: false },
      _count: true,
    }),
    prisma.invoice.groupBy({
      by: ['status'],
      where: { removed: false, expiredDate: { lt: new Date() } },
      _count: true,
    }),
    prisma.invoice.aggregate({
      where: {
        removed: false,
        paymentStatus: { in: ['unpaid', 'partially'] },
      },
      _sum: { total: true, credit: true },
    }),
  ]);

  const totalCount = totalInvoice._count || 0;
  const totalAmount = totalInvoice._sum?.total || 0;

  const statusResultMap = statusCounts.map((item) => ({
    status: item.status,
    count: item._count,
    percentage: totalCount > 0 ? Math.round((item._count / totalCount) * 100) : 0,
  }));

  const paymentStatusResultMap = paymentStatusCounts.map((item) => ({
    status: item.paymentStatus,
    count: item._count,
    percentage: totalCount > 0 ? Math.round((item._count / totalCount) * 100) : 0,
  }));

  const overdueResultMap = overdueCounts.map((item) => ({
    status: 'overdue',
    count: item._count,
    percentage: totalCount > 0 ? Math.round((item._count / totalCount) * 100) : 0,
  }));

  let result = [];
  statuses.forEach((status) => {
    const found = [...paymentStatusResultMap, ...statusResultMap, ...overdueResultMap].find(
      (item) => item.status === status
    );
    if (found) {
      result.push(found);
    }
  });

  const unpaidTotal = (unpaid._sum?.total || 0) - (unpaid._sum?.credit || 0);

  const finalResult = {
    total: totalAmount,
    total_undue: unpaidTotal,
    type,
    performance: result,
  };

  return res.status(200).json({
    success: true,
    result: finalResult,
    message: `Successfully found all invoices for the last ${defaultType}`,
  });
};

module.exports = summary;
