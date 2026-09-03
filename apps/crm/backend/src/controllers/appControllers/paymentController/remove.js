const prisma = require('@/db/prisma');

const remove = async (req, res) => {
  const previousPayment = await prisma.payment.findFirst({
    where: { id: req.params.id, removed: false },
    include: { invoice: true },
  });

  if (!previousPayment) {
    return res.status(404).json({
      success: false,
      result: null,
      message: 'No document found ',
    });
  }

  const { id: paymentId, amount: previousAmount } = previousPayment;
  const { id: invoiceId, total, discount, credit: previousCredit } = previousPayment.invoice;

  const result = await prisma.payment.update({
    where: { id: req.params.id },
    data: { removed: true },
  });

  let paymentStatus =
    total - discount === previousCredit - previousAmount
      ? 'paid'
      : previousCredit - previousAmount > 0
      ? 'partially'
      : 'unpaid';

  await prisma.invoice.update({
    where: { id: invoiceId },
    data: {
      payment: previousPayment.invoice.payment.filter((p) => p !== paymentId),
      credit: { decrement: previousAmount },
      paymentStatus,
    },
  });

  return res.status(200).json({
    success: true,
    result,
    message: 'Successfully Deleted the document ',
  });
};

module.exports = remove;
