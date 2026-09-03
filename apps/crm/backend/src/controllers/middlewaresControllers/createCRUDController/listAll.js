const listAll = async (Model, req, res) => {
  try {
    const sort = req.query.sort || 'desc';
    const enabled = req.query.enabled;

    const where = { removed: false };
    if (enabled !== undefined) {
      where.enabled = enabled === 'true';
    }

    const result = await Model.findMany({
      where,
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
  } catch (error) {
    return res.status(500).json({
      success: false,
      result: null,
      message: error.message,
    });
  }
};

module.exports = listAll;
