const prisma = require('@/db/prisma');

const read = async (userModel, req, res) => {
  try {
    const tmpResult = await prisma.admin.findFirst({
      where: { id: req.params.id, removed: false },
    });

    if (!tmpResult) {
      return res.status(404).json({
        success: false,
        result: null,
        message: 'No document found ',
      });
    }

    const result = {
      _id: tmpResult.id,
      enabled: tmpResult.isActive,
      email: tmpResult.email,
      name: tmpResult.name,
      surname: tmpResult.surname,
      photo: tmpResult.photo,
      role: tmpResult.role,
    };

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
