const filter = async (Model, req, res) => {
  try {
    if (req.query.filter === undefined || req.query.equal === undefined) {
      return res.status(403).json({
        success: false,
        result: null,
        message: 'filter not provided correctly',
      });
    }

    const result = await Model.findMany({
      where: {
        removed: false,
        [req.query.filter]: req.query.equal,
      },
    });

    if (!result) {
      return res.status(404).json({
        success: false,
        result: null,
        message: 'No document found ',
      });
    }
    return res.status(200).json({
      success: true,
      result,
      message: 'Successfully found all documents  ',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      result: null,
      message: error.message,
    });
  }
};

module.exports = filter;
