const read = async (Model, req, res) => {
  try {
    const result = await Model.findUnique({
      where: { id: req.params.id, removed: false },
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
      message: 'we found this document ',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      result: null,
      message: error.message,
    });
  }
};

module.exports = read;
