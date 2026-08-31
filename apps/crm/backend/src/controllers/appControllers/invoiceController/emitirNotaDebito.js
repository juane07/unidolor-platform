const mongoose = require('mongoose');

const Model = mongoose.model('Invoice');
const { calculate } = require('@/helpers');
const { nextNcf } = require('@/helpers/ncf');

/**
 * Nota de débito por ALZA sobre una factura emitida (RN-023, RF-038).
 *
 * Emite una ND (tipo 03) con `notaRef` al original. El original permanece `emitida`.
 */
const emitirNotaDebito = async (req, res) => {
  try {
    const { id } = req.params;
    const { motivo, items } = req.body || {};

    const original = await Model.findOne({ _id: id, removed: false });
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

    const branchId = original.branch?._id || original.branch || null;
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

    const notaDebito = new Model({
      removed: false,
      createdBy: req.admin._id,
      number: original.number,
      year: original.year,
      date: new Date(),
      expiredDate: new Date(),
      client: original.client,
      branch: original.branch,
      doctor: original.doctor,
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
      notaRef: original._id,
      status: 'pending',
      bitacora: [
        {
          accion: 'nota_debito',
          usuario: req.admin._id,
          fecha: new Date(),
          detalle: `ND ${reservado.ncf} por alza sobre ${original.ncf}${motivo ? ': ' + motivo : ''}`,
        },
      ],
    });
    await notaDebito.save();

    await Model.updateOne(
      { _id: original._id, removed: false },
      {
        $push: {
          bitacora: {
            accion: 'nota_debito',
            usuario: req.admin._id,
            fecha: new Date(),
            detalle: `ND ${reservado.ncf} emitida (alza)${motivo ? ': ' + motivo : ''}`,
          },
        },
        $set: { updated: Date.now() },
      }
    );

    return res.status(200).json({
      success: true,
      result: { original: original._id, notaDebito },
      message: `Nota de débito ${reservado.ncf} emitida por RD$${total}`,
    });
  } catch (err) {
    return res.status(500).json({ success: false, result: null, message: err.message });
  }
};

module.exports = emitirNotaDebito;