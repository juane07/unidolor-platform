const prisma = require('@/db/prisma');
const bcrypt = require('bcryptjs');
const { generate: uniqueId } = require('shortid');

const updateProfilePassword = async (userModel, req, res) => {
  try {
    const reqUserName = userModel.toLowerCase();
    const userProfile = req[reqUserName];
    let { password, passwordCheck } = req.body;

    if (!password || !passwordCheck)
      return res.status(400).json({ msg: 'Not all fields have been entered.' });

    if (password.length < 8)
      return res.status(400).json({
        msg: 'The password needs to be at least 8 characters long.',
      });

    if (password !== passwordCheck)
      return res.status(400).json({ msg: 'Enter the same password twice for verification.' });

    if (userProfile.email === 'admin@admin.com') {
      return res.status(403).json({
        success: false,
        result: null,
        message: "you couldn't update demo password",
      });
    }

    const salt = uniqueId();
    const passwordHash = bcrypt.hashSync(salt + password);

    const passwordRecord = await prisma.adminPassword.findFirst({
      where: { adminId: userProfile.id, removed: false },
    });

    if (!passwordRecord) {
      return res.status(403).json({
        success: false,
        result: null,
        message: "User Password couldn't save correctly",
      });
    }

    await prisma.adminPassword.update({
      where: { id: passwordRecord.id },
      data: { password: passwordHash, salt: salt },
    });

    return res.status(200).json({
      success: true,
      result: {},
      message: 'we update the password by this id: ' + userProfile.id,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      result: null,
      message: error.message,
    });
  }
};

module.exports = updateProfilePassword;
