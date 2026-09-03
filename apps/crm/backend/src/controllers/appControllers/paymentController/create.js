const prisma = require('@/db/prisma');
const { calculate } = require('@/helpers');

const create = async (req, res) => {
  if (req.body.amount === 0) {
    return res.status(202).json({
      success: false,
      result: null,
      message: `The Minimum Amount couldn't be 0`,
    });
  }

  const currentInvoice = await prisma.invoice.findFirst({
    where: { id: req.body.invoice, removed: false },
  });

  if (!currentInvoice) {
    return res.status(404).json({ success: false, result: null, message: 'Invoice not found' });
  }

  const { total: previousTotal, discount: previousDiscount, credit: previousCredit } = currentInvoice;
  const maxAmount = calculate.sub(calculate.sub(previousTotal, previousDiscount), previousCredit);

  if (req.body.amount > maxAmount) {
    return res.status(202).json({
      success: false,
      result: null,
      message: `The Max Amount you can add is ${maxAmount}`,
    });
  }

  let commissionRate = 0;
  let doctorId = null;

  if (currentInvoice.doctorId) {
    const doctor = await prisma.doctor.findUnique({ where: { id: currentInvoice.doctorId } });
    if (doctor) {
      commissionRate = doctor.commissionRate || 0;
      doctorId = doctor.id;
    }
  }

  const createData = {
    ...req.body,
    createdById: req.admin.id,
  };

  if (commissionRate > 0) {
    createData.commissionRate = commissionRate;
    createData.commissionAmount = calculate.multiply(req.body.amount, commissionRate / 100);
    createData.doctorId = doctorId;
  }

  const result = await prisma.payment.create({ data: createData });

  const fileId = 'payment-' + result.id + '.pdf';
  const updatePath = await prisma.payment.update({
    where: { id: result.id },
    data: { pdf: fileId },
  });

  const { id: paymentId, amount } = result;
  const { total, discount, credit } = currentInvoice;

  let paymentStatus =
    calculate.sub(total, discount) === calculate.add(credit, amount)
      ? 'paid'
      : calculate.add(credit, amount) > 0
      ? 'partially'
      : 'unpaid';

  await prisma.invoice.update({
    where: { id: currentInvoice.id },
    data: {
      payment: { push: paymentId },
      credit: { increment: amount },
      paymentStatus,
    },
  });

  return res.status(200).json({
    success: true,
    result: updatePath,
    message: 'Payment Invoice created successfully',
  });
};

module.exports = create;
