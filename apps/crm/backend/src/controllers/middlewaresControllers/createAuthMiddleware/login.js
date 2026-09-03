const Joi = require('joi');
const prisma = require('@/db/prisma');
const authUser = require('./authUser');

const login = async (req, res, { userModel }) => {
  const { email, password } = req.body;

  const objectSchema = Joi.object({
    email: Joi.string()
      .email({ tlds: { allow: true } })
      .required(),
    password: Joi.string().required(),
  });

  const { error, value } = objectSchema.validate({ email, password });
  if (error) {
    return res.status(409).json({
      success: false,
      result: null,
      error: error,
      message: 'Invalid/Missing credentials.',
      errorMessage: error.message,
    });
  }

  const user = await prisma.admin.findFirst({
    where: { email: email, removed: false },
    include: { passwordRecords: { where: { removed: false } } },
  });

  if (!user)
    return res.status(404).json({
      success: false,
      result: null,
      message: 'No account with this email has been registered.',
    });

  const databasePassword = user.passwordRecords[0];

  if (!user.isActive)
    return res.status(409).json({
      success: false,
      result: null,
      message: 'Your account is disabled, contact your account adminstrator',
    });

  authUser(req, res, {
    user,
    databasePassword,
    password,
    prismaClient: prisma.adminPassword,
  });
};

module.exports = login;
