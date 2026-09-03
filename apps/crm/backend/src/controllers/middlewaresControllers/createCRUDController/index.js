const create = require('./create');
const read = require('./read');
const update = require('./update');
const remove = require('./remove');
const search = require('./search');
const filter = require('./filter');
const summary = require('./summary');
const listAll = require('./listAll');
const paginatedList = require('./paginatedList');
const { getPrismaModel } = require('@/models/utils');

module.exports = function createCRUDController(modelName) {
  const prismaModel = getPrismaModel(modelName);

  return {
    read: (req, res) => read(prismaModel, req, res),
    create: (req, res) => create(prismaModel, req, res),
    update: (req, res) => update(prismaModel, req, res),
    delete: (req, res) => remove(prismaModel, req, res),
    search: (req, res) => search(prismaModel, req, res),
    filter: (req, res) => filter(prismaModel, req, res),
    summary: (req, res) => summary(prismaModel, req, res),
    list: (req, res) => paginatedList(prismaModel, req, res),
    listAll: (req, res) => listAll(prismaModel, req, res),
  };
};
