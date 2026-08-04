const mongoose = require('mongoose');
const createCRUDController = require('@/controllers/middlewaresControllers/createCRUDController');

const summary = require('./summary');

function modelController() {
  const Model = mongoose.model('Client');
  const methods = createCRUDController('Client');

  methods.summary = (req, res) => summary(Model, req, res);

  // GET /api/client/detail/:id - Vista detalle completa del cliente
  methods.detail = async (req, res) => {
    console.log('=== CLIENT DETAIL HIT ===');
    return res.status(200).json({
      success: true,
      result: { test: 'ok' },
      message: 'Test response',
    });
  };

  return methods;
}

module.exports = modelController();