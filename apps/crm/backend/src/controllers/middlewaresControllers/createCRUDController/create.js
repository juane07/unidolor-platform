const create = async (Model, req, res) => {
  try {
    req.body.removed = false;
    const result = await Model.create({ data: req.body });
    return res.status(200).json({
      success: true,
      result,
      message: 'Successfully Created the document in Model ',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      result: null,
      message: error.message,
      error,
    });
  }
};

module.exports = create;
