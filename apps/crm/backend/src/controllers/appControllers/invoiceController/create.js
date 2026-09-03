const prisma = require('@/db/prisma');
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

  let subTotal = 0;
  let taxTotal = 0;
  let total = 0;

  items.map((item) => {
    let total = calculate.multiply(item['quantity'], item['price']);
    subTotal = calculate.add(subTotal, total);
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
  cuerpo['createdById'] = req.admin.id;

  const result = await prisma.invoice.create({
    data: {
      ...cuerpo,
      createdById: req.admin.id,
      bitacora: [
        {
          accion: 'creacion',
          usuario: req.admin.id,
          fecha: new Date(),
          detalle: cuerpo.estadoFiscal === 'emitida' ? 'Factura emitida con NCF ' + cuerpo.ncf : 'Factura creada como borrador',
        },
      ],
    },
  });

  const fileId = 'invoice-' + result.id + '.pdf';
  const updateResult = await prisma.invoice.update({
    where: { id: result.id },
    data: { pdf: fileId },
  });

  increaseBySettingKey({ settingKey: 'last_invoice_number' });

  return res.status(200).json({
    success: true,
    result: updateResult,
    message: 'Invoice created successfully',
  });
};

module.exports = create;
