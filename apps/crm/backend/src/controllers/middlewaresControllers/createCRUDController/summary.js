const summary = async (Model, req, res) => {
  try {
    const countAllDocs = await Model.count({ where: { removed: false } });

    let countFilter = countAllDocs;
    if (req.query.filter && req.query.equal !== undefined) {
      countFilter = await Model.count({
        where: {
          removed: false,
          [req.query.filter]: req.query.equal,
        },
      });
    }

    if (countAllDocs > 0) {
      return res.status(200).json({
        success: true,
        result: { countFilter, countAllDocs },
        message: 'Successfully count all documents',
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

module.exports = summary;
