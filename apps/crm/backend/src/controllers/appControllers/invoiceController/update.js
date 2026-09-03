const prisma = require('@/db/prisma');
const { calculate } = require('@/helpers');
const schema = require('./schemaValidate');

const update = async (req, res) => {
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

  const previousInvoice = await prisma.invoice.findFirst({
    where: { id: req.params.id, removed: false },
  });

  if (!previousInvoice) {
    return res.status(404).json({
      success: false,
      result: null,
      message: 'Invoice not found',
    });
  }

  if (previousInvoice.estadoFiscal && previousInvoice.estadoFiscal !== 'borrador') {
    return res.status(400).json({
      success: false,
      result: null,
      message: 'Factura emitida no editable; use nota de crédito/débito (RN-023)',
    });
  }

  const { credit } = previousInvoice;
  const { items = [], taxRate = 0, discount = 0 } = req.body;

  if (items.length === 0) {
    return res.status(400).json({
      success: false,
      result: null,
      message: 'Items cannot be empty',
    });
  }

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
  body['pdf'] = 'invoice-' + req.params.id + '.pdf';
  if (body.hasOwnProperty('currency')) {
    delete body.currency;
  }

  let paymentStatus =
    calculate.sub(total, discount) === credit ? 'paid' : credit > 0 ? 'partially' : 'unpaid';
  body['paymentStatus'] = paymentStatus;

  const result = await prisma.invoice.update({
    where: { id: req.params.id, removed: false },
    data: body,
  });

  return res.status(200).json({
    success: true,
    result,
    message: 'we update this document ',
  });
};

module.exports = update;
