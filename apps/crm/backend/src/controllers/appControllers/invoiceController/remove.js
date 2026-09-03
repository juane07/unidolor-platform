const prisma = require('@/db/prisma');

const remove = async (req, res) => {
  const existing = await prisma.invoice.findFirst({
    where: { id: req.params.id, removed: false },
  });

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

  const deletedInvoice = await prisma.invoice.update({
    where: { id: req.params.id },
    data: { removed: true },
  });

  await prisma.payment.updateMany({
    where: { invoiceId: deletedInvoice.id },
    data: { removed: true },
  });

  return res.status(200).json({
    success: true,
    result: deletedInvoice,
    message: 'Invoice deleted successfully',
  });
};

module.exports = remove;
