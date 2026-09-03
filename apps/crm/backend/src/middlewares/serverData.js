const prisma = require('@/db/prisma');

const modelMap = {
  Setting: prisma.setting,
  Notification: prisma.notification,
  Branch: prisma.branch,
  Doctor: prisma.doctor,
  Client: prisma.client,
};

exports.getData = ({ model }) => {
  const prismaModel = modelMap[model];
  if (!prismaModel) return Promise.resolve([]);
  return prismaModel.findMany({ where: { removed: false, isActive: true } });
};

exports.getOne = ({ model, id }) => {
  const prismaModel = modelMap[model];
  if (!prismaModel) return Promise.resolve(null);
  return prismaModel.findFirst({ where: { id, removed: false } });
};
