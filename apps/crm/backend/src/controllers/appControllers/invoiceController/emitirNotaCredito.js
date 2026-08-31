const mongoose = require('mongoose');

const Model = mongoose.model('Invoice');
const { calculate } = require('@/helpers');
const { nextNcf } = require('@/helpers/ncf');

/**
 * Nota de crédito por rebaja PARCIAL (RN-023, RF-038).
 *
 * Emite una NC (tipo 04) con `notaRef` al original. El original permanece
 * `emitida`; solo se marca `nota_credito` en anulación total (ver `anular.js`).
 */
const emitirNotaCredito = async (req, res) => {
  try {
    const { id } = req.params;
    const { motivo, monto, items } = req.body || {};

    const original = await Model.findOne({ _id: id, removed: false });
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

    const branchId = original.branch?._id || original.branch || null;
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

    const notaCredito = new Model({
      removed: false,
      createdBy: req.admin._id,
      number: original.number,
      year: original.year,
      date: new Date(),
      expiredDate: new Date(),
      client: original.client,
      branch: original.branch,
      doctor: original.doctor,
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
      notaRef: original._id,
      status: 'refunded',
      bitacora: [
        {
          accion: 'nota_credito',
          usuario: req.admin._id,
          fecha: new Date(),
          detalle: `NC ${reservado.ncf} por rebaja parcial de ${original.ncf}${motivo ? ': ' + motivo : ''}`,
        },
      ],
    });
    await notaCredito.save();

    await Model.updateOne(
      { _id: original._id, removed: false },
      {
        $push: {
          bitacora: {
            accion: 'nota_credito',
            usuario: req.admin._id,
            fecha: new Date(),
            detalle: `NC ${reservado.ncf} emitida (rebaja parcial)${motivo ? ': ' + motivo : ''}`,
          },
        },
        $set: { updated: Date.now() },
      }
    );

    return res.status(200).json({
      success: true,
      result: { original: original._id, notaCredito },
      message: `Nota de crédito ${reservado.ncf} emitida por RD$${total}`,
    });
  } catch (err) {
    return res.status(500).json({ success: false, result: null, message: err.message });
  }
};

module.exports = emitirNotaCredito;