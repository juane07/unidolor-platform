const mongoose = require('mongoose');

const listUnread = async (req, res) => {
  const Model = mongoose.model('Notification');
  const items = await Model.find({ removed: false, isRead: false }).sort({ created: -1 }).limit(20);
  const count = await Model.countDocuments({ removed: false, isRead: false });
  return res.json({ success: true, result: items, count });
};

const markRead = async (req, res) => {
  const Model = mongoose.model('Notification');
  const { id } = req.params;
  await Model.findByIdAndUpdate(id, { isRead: true, updated: Date.now() });
  return res.json({ success: true });
};

const markAllRead = async (req, res) => {
  const Model = mongoose.model('Notification');
  await Model.updateMany({ removed: false, isRead: false }, { isRead: true, updated: Date.now() });
  return res.json({ success: true });
};

module.exports = { listUnread, markRead, markAllRead };
