const prisma = require('@/db/prisma');
const { calculate } = require('@/helpers');
const { nextNcf } = require('@/helpers/ncf');

const emitirNotaDebito = async (req, res) => {
  try {
    const { id } = req.params;
    const { motivo, items } = req.body || {};

    const original = await prisma.invoice.findFirst({ where: { id, removed: false } });
    if (!original) {
      return res.status(404).json({ success: false, result: null, message: 'Factura no encontrada' });
    }
    if (original.estadoFiscal !== 'emitida') {
      return res.status(400).json({
        success: false,
        result: null,
        message: `Solo se puede emitir ND sobre una factura emitida (estado actual: ${original.estadoFiscal})`,
      });
    }
    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, result: null, message: 'items es requerido para la nota de débito' });
    }

    const branchId = original.branchId || null;
    const reservado = await nextNcf('03', branchId);

    let subTotal = 0;
    const ndItems = items.map((it) => {
      const total = calculate.multiply(it.quantity, it.price);
      subTotal = calculate.add(subTotal, total);
      return {
        service: it.service,
        cupsCode: it.cupsCode,
        simonLevel: it.simonLevel,
        itemName: it.itemName,
        description: it.description,
        quantity: it.quantity,
        price: it.price,
        total,
      };
    });
    const taxTotal = calculate.multiply(subTotal, (original.taxRate || 0) / 100);
    const total = calculate.add(subTotal, taxTotal);

    const notaDebito = await prisma.invoice.create({
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
        items: ndItems,
        taxRate: original.taxRate || 0,
        subTotal,
        taxTotal,
        total,
        currency: original.currency,
        discount: 0,
        paymentStatus: calculate.sub(total, 0) === 0 ? 'paid' : 'unpaid',
        ncf: reservado.ncf,
        ncfTipo: reservado.tipo,
        regimen: reservado.regimen,
        estadoFiscal: 'emitida',
        notaRefId: original.id,
        status: 'pending',
        bitacora: [
          {
            accion: 'nota_debito',
            usuario: req.admin.id,
            fecha: new Date(),
            detalle: `ND ${reservado.ncf} por alza sobre ${original.ncf}${motivo ? ': ' + motivo : ''}`,
          },
        ],
      },
    });

    await prisma.invoice.update({
      where: { id: original.id },
      data: {
        bitacora: {
          push: {
            accion: 'nota_debito',
            usuario: req.admin.id,
            fecha: new Date(),
            detalle: `ND ${reservado.ncf} emitida (alza)${motivo ? ': ' + motivo : ''}`,
          },
        },
        updated: new Date(),
      },
    });

    return res.status(200).json({
      success: true,
      result: { original: original.id, notaDebito },
      message: `Nota de débito ${reservado.ncf} emitida por RD$${total}`,
    });
  } catch (err) {
    return res.status(500).json({ success: false, result: null, message: err.message });
  }
};

module.exports = emitirNotaDebito;
