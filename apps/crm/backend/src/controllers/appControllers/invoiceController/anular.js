const prisma = require('@/db/prisma');
const { calculate } = require('@/helpers');
const { nextNcf } = require('@/helpers/ncf');

const anular = async (req, res) => {
  try {
    const { id } = req.params;
    const { motivo } = req.body || {};

    const original = await prisma.invoice.findFirst({ where: { id, removed: false } });
    if (!original) {
      return res.status(404).json({ success: false, result: null, message: 'Factura no encontrada' });
    }
    if (original.estadoFiscal !== 'emitida') {
      return res.status(400).json({
        success: false,
        result: null,
        message: `Solo se puede anular una factura emitida (estado actual: ${original.estadoFiscal})`,
      });
    }

    const branchId = original.branchId || null;
    const reservado = await nextNcf('04', branchId);

    const notaCredito = await prisma.invoice.create({
      data: {
        removed: false,
        createdById: req.admin.id,
        number: original.number,
        year: original.year,
        date: new Date(),
        expiredDate: new Date(),
        clientId: original.clientId,
        branchId: original.branchId,
        doctorId: original.doctorId,
        items: original.items.map((it) => ({ ...it, total: calculate.sub(0, it.total) })),
        taxRate: original.taxRate,
        subTotal: calculate.sub(0, original.subTotal),
        taxTotal: calculate.sub(0, original.taxTotal),
        total: calculate.sub(0, original.total),
        currency: original.currency,
        discount: 0,
        paymentStatus: 'unpaid',
        ncf: reservado.ncf,
        ncfTipo: reservado.tipo,
        regimen: reservado.regimen,
        estadoFiscal: 'emitida',
        notaRefId: original.id,
        status: 'refunded',
        bitacora: [
          {
            accion: 'nota_credito',
            usuario: req.admin.id,
            fecha: new Date(),
            detalle: `NC ${reservado.ncf} por anulación total de ${original.ncf}${motivo ? ': ' + motivo : ''}`,
          },
        ],
      },
    });

    const anulada = await prisma.invoice.update({
      where: { id: original.id },
      data: {
        estadoFiscal: 'anulada',
        motivo: motivo || null,
        updated: new Date(),
        bitacora: {
          push: {
            accion: 'anulacion',
            usuario: req.admin.id,
            fecha: new Date(),
            detalle: `Anulación total → NC ${reservado.ncf}`,
          },
        },
      },
    });

    return res.status(200).json({
      success: true,
      result: { anulada, notaCredito },
      message: `Factura ${original.ncf} anulada. Nota de crédito ${reservado.ncf} emitida.`,
    });
  } catch (err) {
    return res.status(500).json({ success: false, result: null, message: err.message });
  }
};

module.exports = anular;
