const remove = async (Model, req, res) => {
  try {
    const result = await Model.update({
      where: { id: req.params.id },
      data: { removed: true },
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
      message: 'Successfully Deleted the document ',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      result: null,
      message: error.message,
    });
  }
};

module.exports = remove;
