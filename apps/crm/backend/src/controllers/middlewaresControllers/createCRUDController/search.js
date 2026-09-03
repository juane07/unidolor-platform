const search = async (Model, req, res) => {
  try {
    const fieldsArray = req.query.fields ? req.query.fields.split(',') : ['name'];

    const where = {
      removed: false,
      OR: fieldsArray.map((field) => ({
        [field]: { contains: req.query.q || '', mode: 'insensitive' },
      })),
    };

    const results = await Model.findMany({
      where,
      take: 20,
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
  } catch (error) {
    return res.status(500).json({
      success: false,
      result: null,
      message: error.message,
    });
  }
};

module.exports = search;
