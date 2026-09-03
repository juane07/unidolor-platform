const prisma = require('@/db/prisma');

const listUnread = async (req, res) => {
  const items = await prisma.notification.findMany({
    where: { removed: false, isRead: false },
    orderBy: { created: 'desc' },
    take: 20,
  });
  const count = await prisma.notification.count({
    where: { removed: false, isRead: false },
  });
  return res.json({ success: true, result: items, count });
};

const markRead = async (req, res) => {
  const { id } = req.params;
  await prisma.notification.update({
    where: { id },
    data: { isRead: true, updated: new Date() },
  });
  return res.json({ success: true });
};

const markAllRead = async (req, res) => {
  await prisma.notification.updateMany({
    where: { removed: false, isRead: false },
    data: { isRead: true, updated: new Date() },
  });
  return res.json({ success: true });
};

module.exports = { listUnread, markRead, markAllRead };
