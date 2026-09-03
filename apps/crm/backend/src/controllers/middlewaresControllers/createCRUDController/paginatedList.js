const paginatedList = async (Model, req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = parseInt(req.query.items) || 10;
    const skip = page * limit - limit;

    const { sortBy = 'enabled', sortValue = '-1', filter, equal } = req.query;

    const fieldsArray = req.query.fields ? req.query.fields.split(',') : [];

    const where = { removed: false };

    // Text search across fields
    if (fieldsArray.length > 0 && req.query.q) {
      where.OR = fieldsArray.map((field) => ({
        [field]: { contains: req.query.q, mode: 'insensitive' },
      }));
    }

    // Exact filter
    if (filter && equal !== undefined) {
      where[filter] = equal;
    }

    const orderBy = { [sortBy]: sortValue === '-1' || sortValue === -1 ? 'desc' : 'asc' };

    const [result, count] = await Promise.all([
      Model.findMany({ where, skip, take: limit, orderBy }),
      Model.count({ where }),
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
  } catch (error) {
    return res.status(500).json({
      success: false,
      result: null,
      message: error.message,
    });
  }
};

module.exports = paginatedList;
