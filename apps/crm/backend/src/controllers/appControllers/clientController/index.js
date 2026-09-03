const createCRUDController = require('@/controllers/middlewaresControllers/createCRUDController');
const summary = require('./summary');

function modelController() {
  const methods = createCRUDController('Client');
  methods.summary = summary;
  methods.detail = async (req, res) => {
    return res.status(200).json({
      success: true,
      result: { test: 'ok' },
      message: 'Test response',
    });
  };
  return methods;
}

module.exports = modelController();
