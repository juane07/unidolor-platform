const prisma = require('@/db/prisma');

const updateProfile = async (userModel, req, res) => {
  try {
    const reqUserName = userModel.toLowerCase();
    const userProfile = req[reqUserName];

    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (userProfile.email === 'admin@demo.com') {
      return res.status(403).json({
        success: false,
        result: null,
        message: "you couldn't update demo informations",
      });
    }

    const updates = {
      email: req.body.email,
      name: req.body.name,
      surname: req.body.surname,
    };
    if (req.body.photo) {
      updates.photo = req.body.photo;
    }

    const result = await prisma.admin.update({
      where: { id: userProfile.id, removed: false },
      data: updates,
    });

    if (!result) {
      return res.status(404).json({
        success: false,
        result: null,
        message: 'No profile found by this id: ' + userProfile.id,
      });
    }

    return res.status(200).json({
      success: true,
      result: {
        _id: result.id,
        enabled: result.isActive,
        email: result.email,
        name: result.name,
        surname: result.surname,
        photo: result.photo,
        role: result.role,
        token,
      },
      message: 'we update this profile by this id: ' + userProfile.id,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      result: null,
      message: error.message,
    });
  }
};

module.exports = updateProfile;
