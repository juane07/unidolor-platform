const prisma = require('@/db/prisma');

const logout = async (req, res, { userModel }) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  const passwordRecord = await prisma.adminPassword.findFirst({
    where: { adminId: req.admin.id, removed: false },
  });

  if (passwordRecord) {
    if (token) {
      await prisma.adminPassword.update({
        where: { id: passwordRecord.id },
        data: {
          loggedSessions: passwordRecord.loggedSessions.filter((t) => t !== token),
        },
      });
    } else {
      await prisma.adminPassword.update({
        where: { id: passwordRecord.id },
        data: { loggedSessions: [] },
      });
    }
  }

  return res.json({
    success: true,
    result: {},
    message: 'Successfully logout',
  });
};

module.exports = logout;
