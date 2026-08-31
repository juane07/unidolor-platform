const mongoose = require('mongoose');

const Model = mongoose.model('Invoice');
const ModelPayment = mongoose.model('Payment');

const remove = async (req, res) => {
  const existing = await Model.findOne({
    _id: req.params.id,
    removed: false,
  }).exec();

  if (!existing) {
    return res.status(404).json({
      success: false,
      result: null,
      message: 'Invoice not found',
    });
  }

  if (existing.estadoFiscal && existing.estadoFiscal !== 'borrador') {
    return res.status(400).json({
      success: false,
      result: null,
      message: 'No se puede borrar un NCF emitido; use anulación y nota de crédito (RN-023)',
    });
  }

  const deletedInvoice = await Model.findOneAndUpdate(
    {
      _id: req.params.id,
      removed: false,
    },
    {
      $set: {
        removed: true,
      },
    }
  ).exec();

  if (!deletedInvoice) {
    return res.status(404).json({
      success: false,
      result: null,
      message: 'Invoice not found',
    });
  }
  const paymentsInvoices = await ModelPayment.updateMany(
    { invoice: deletedInvoice._id },
    { $set: { removed: true } }
  );
  return res.status(200).json({
    success: true,
    result: deletedInvoice,
    message: 'Invoice deleted successfully',
  });
};

module.exports = remove;
