const prisma = require('@/db/prisma');
const { calculate } = require('@/helpers');
const { nextNcf } = require('@/helpers/ncf');

const emitirNotaCredito = async (req, res) => {
  try {
    const { id } = req.params;
    const { motivo, monto, items } = req.body || {};

    const original = await prisma.invoice.findFirst({ where: { id, removed: false } });
    if (!original) {
      return res.status(404).json({ success: false, result: null, message: 'Factura no encontrada' });
    }
    if (original.estadoFiscal !== 'emitida') {
      return res.status(400).json({
        success: false,
        result: null,
        message: `Solo se puede emitir NC sobre una factura emitida (estado actual: ${original.estadoFiscal})`,
      });
    }

    const branchId = original.branchId || null;
    const reservado = await nextNcf('04', branchId);

    const ncItems = items && items.length
      ? items
      : original.items.map((it) => {
          const unitario = it.quantity ? it.total / it.quantity : 0;
          return {
            service: it.service,
            cupsCode: it.cupsCode,
            simonLevel: it.simonLevel,
            itemName: it.itemName,
            description: it.description,
            quantity: it.quantity,
            price: unitario,
            total: monto ? calculate.div(monto, original.items.length) : it.total,
          };
        });

    let subTotal = 0;
    ncItems.forEach((it) => {
      const total = calculate.multiply(it.quantity, it.price);
      it.total = total;
      subTotal = calculate.add(subTotal, total);
    });
    const taxTotal = calculate.multiply(subTotal, (original.taxRate || 0) / 100);
    const total = calculate.add(subTotal, taxTotal);

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
        items: ncItems,
        taxRate: original.taxRate || 0,
        subTotal,
        taxTotal,
        total,
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
            detalle: `NC ${reservado.ncf} por rebaja parcial de ${original.ncf}${motivo ? ': ' + motivo : ''}`,
          },
        ],
      },
    });

    await prisma.invoice.update({
      where: { id: original.id },
      data: {
        bitacora: {
          push: {
            accion: 'nota_credito',
            usuario: req.admin.id,
            fecha: new Date(),
            detalle: `NC ${reservado.ncf} emitida (rebaja parcial)${motivo ? ': ' + motivo : ''}`,
          },
        },
        updated: new Date(),
      },
    });

    return res.status(200).json({
      success: true,
      result: { original: original.id, notaCredito },
      message: `Nota de crédito ${reservado.ncf} emitida por RD$${total}`,
    });
  } catch (err) {
    return res.status(500).json({ success: false, result: null, message: err.message });
  }
};

module.exports = emitirNotaCredito;
