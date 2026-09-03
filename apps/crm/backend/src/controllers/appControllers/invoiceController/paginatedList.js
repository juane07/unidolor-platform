const prisma = require('@/db/prisma');

const paginatedList = async (req, res) => {
  const page = req.query.page || 1;
  const limit = parseInt(req.query.items) || 10;
  const skip = page * limit - limit;

  const { sortBy = 'enabled', sortValue = '-1', filter, equal } = req.query;

  const fieldsArray = req.query.fields ? req.query.fields.split(',') : [];

  const where = { removed: false };

  if (fieldsArray.length > 0 && req.query.q) {
    where.OR = fieldsArray.map((field) => ({
      [field]: { contains: req.query.q, mode: 'insensitive' },
    }));
  }

  if (filter && equal !== undefined) {
    where[filter] = equal;
  }

  const orderBy = { [sortBy]: sortValue === '-1' || sortValue === -1 ? 'desc' : 'asc' };

  const [result, count] = await Promise.all([
    prisma.invoice.findMany({
      where,
      skip,
      take: limit,
      orderBy,
      include: { createdBy: { select: { name: true, id: true } } },
    }),
    prisma.invoice.count({ where }),
  ]);

  const pages = Math.ceil(count / limit);
  const pagination = { page, pages, count };

  if (count > 0) {
    return res.status(200).json({
      success: true,
      result,
      pagination,
      message: 'Successfully found all documents',
    });
  }
  return res.status(203).json({
    success: true,
    result: [],
    pagination,
    message: 'Collection is Empty',
  });
};

module.exports = paginatedList;
