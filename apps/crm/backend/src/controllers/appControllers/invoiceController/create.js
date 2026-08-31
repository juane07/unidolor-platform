const mongoose = require('mongoose');

const Model = mongoose.model('Invoice');

const { calculate } = require('@/helpers');
const { increaseBySettingKey } = require('@/middlewares/settings');
const schema = require('./schemaValidate');
const { nextNcf } = require('@/helpers/ncf');

const create = async (req, res) => {
  let body = req.body;

  const { error, value } = schema.validate(body);
  if (error) {
    const { details } = error;
    return res.status(400).json({
      success: false,
      result: null,
      message: details[0]?.message,
    });
  }

  const { items = [], taxRate = 0, discount = 0 } = value;

  // default
  let subTotal = 0;
  let taxTotal = 0;
  let total = 0;

  //Calculate the items array with subTotal, total, taxTotal
  items.map((item) => {
    let total = calculate.multiply(item['quantity'], item['price']);
    //sub total
    subTotal = calculate.add(subTotal, total);
    //item total
    item['total'] = total;
  });
  taxTotal = calculate.multiply(subTotal, taxRate / 100);
  total = calculate.add(subTotal, taxTotal);

  body['subTotal'] = subTotal;
  body['taxTotal'] = taxTotal;
  body['total'] = total;
  body['items'] = items;

  const ncfTipo = body.ncfTipo || '01';
  let cuerpo = { ...body };

  if (body.asignarNcf === false) {
    // Sin NCF: se guarda como borrador (no es comprobante fiscal, RN-023)
    cuerpo.estadoFiscal = 'borrador';
  } else {
    const reservado = await nextNcf(ncfTipo, body.branch || null);
    cuerpo.ncf = reservado.ncf;
    cuerpo.ncfTipo = reservado.tipo;
    cuerpo.regimen = reservado.regimen;
    cuerpo.estadoFiscal = 'emitida';
  }

  let paymentStatus = calculate.sub(cuerpo.total, discount) === 0 ? 'paid' : 'unpaid';

  cuerpo['paymentStatus'] = paymentStatus;
  cuerpo['createdBy'] = req.admin._id;
  cuerpo['bitacora'] = [
    {
      accion: 'creacion',
      usuario: req.admin._id,
      fecha: new Date(),
      detalle: cuerpo.estadoFiscal === 'emitida' ? 'Factura emitida con NCF ' + cuerpo.ncf : 'Factura creada como borrador',
    },
  ];

  // Creating a new document in the collection
  const result = await new Model(cuerpo).save();
  const fileId = 'invoice-' + result._id + '.pdf';
  const updateResult = await Model.findOneAndUpdate(
    { _id: result._id },
    { pdf: fileId },
    {
      new: true,
    }
  ).exec();
  // Returning successfull response

  increaseBySettingKey({
    settingKey: 'last_invoice_number',
  });

  // Returning successfull response
  return res.status(200).json({
    success: true,
    result: updateResult,
    message: 'Invoice created successfully',
  });
};

module.exports = create;
