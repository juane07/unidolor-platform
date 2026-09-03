const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Joi = require('joi');
const prisma = require('@/db/prisma');
const shortid = require('shortid');

const resetPassword = async (req, res, { userModel }) => {
  const { password, userId, resetToken } = req.body;

  const databasePassword = await prisma.adminPassword.findFirst({
    where: { adminId: userId, removed: false },
  });

  const user = await prisma.admin.findFirst({
    where: { id: userId, removed: false },
  });

  if (!user || !user.isActive)
    return res.status(409).json({
      success: false,
      result: null,
      message: 'Your account is disabled, contact your account adminstrator',
    });

  if (!databasePassword || !user)
    return res.status(404).json({
      success: false,
      result: null,
      message: 'No account with this email has been registered.',
    });

  const isMatch = resetToken === databasePassword.resetToken;
  if (!isMatch || !databasePassword.resetToken)
    return res.status(403).json({
      success: false,
      result: null,
      message: 'Invalid reset token',
    });

  const objectSchema = Joi.object({
    password: Joi.string().required(),
    userId: Joi.string().required(),
    resetToken: Joi.string().required(),
  });

  const { error, value } = objectSchema.validate({ password, userId, resetToken });
  if (error) {
    return res.status(409).json({
      success: false,
      result: null,
      error: error,
      message: 'Invalid reset password object',
      errorMessage: error.message,
    });
  }

  const salt = shortid.generate();
  const hashedPassword = bcrypt.hashSync(salt + password);
  const emailToken = shortid.generate();

  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '24h' });

  await prisma.adminPassword.update({
    where: { id: databasePassword.id },
    data: {
      loggedSessions: { push: token },
      password: hashedPassword,
      salt: salt,
      emailToken: emailToken,
      resetToken: shortid.generate(),
      emailVerified: true,
    },
  });

  return res.status(200).json({
    success: true,
    result: {
      _id: user.id,
      name: user.name,
      surname: user.surname,
      role: user.role,
      email: user.email,
      photo: user.photo,
      token: token,
      maxAge: req.body.remember ? 365 : null,
    },
    message: 'Successfully resetPassword user',
  });
};

module.exports = resetPassword;
