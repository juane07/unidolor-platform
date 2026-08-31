const mongoose = require('mongoose');

const Model = mongoose.model('Invoice');
const { calculate } = require('@/helpers');
const { nextNcf } = require('@/helpers/ncf');

/**
 * Anulación total de una factura emitida (RN-023, RF-038).
 *
 * 1. Verifica que la factura exista y esté `emitida`.
 * 2. Marca el original como `anulada` con motivo registrado en bitácora.
 * 3. Emite una NOTA DE CRÉDITO (tipo 04) cuyo total revierte el original,
 *    con `notaRef` apuntando al original.
 *
 * Nota: las rebajas parciales usan `emitirNotaCredito` (el original permanece
 * `emitida`). Este flujo solo aplica para anulación total.
 */
const anular = async (req, res) => {
  try {
    const { id } = req.params;
    const { motivo } = req.body || {};

    const original = await Model.findOne({ _id: id, removed: false });
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

    // 1. Reserva atómica del NCF tipo 04 (nota de crédito)
    const branchId = original.branch?._id || original.branch || null;
    const reservado = await nextNcf('04', branchId);

    // 2. Crear la nota de crédito que revierte el original
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
      items: original.items.map((it) => ({ ...it.toObject(), total: calculate.sub(0, it.total) })),
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
      notaRef: original._id,
      status: 'refunded',
      bitacora: [
        {
          accion: 'nota_credito',
          usuario: req.admin._id,
          fecha: new Date(),
          detalle: `NC ${reservado.ncf} por anulación total de ${original.ncf}${motivo ? ': ' + motivo : ''}`,
        },
      ],
    });
    await notaCredito.save();

    // 3. Marcar el original como anulada
    const anulada = await Model.findOneAndUpdate(
      { _id: original._id, removed: false },
      {
        $set: {
          estadoFiscal: 'anulada',
          motivo: motivo || null,
          updated: Date.now(),
        },
        $push: {
          bitacora: {
            accion: 'anulacion',
            usuario: req.admin._id,
            fecha: new Date(),
            detalle: `Anulación total → NC ${reservado.ncf}`,
          },
        },
      },
      { new: true }
    );

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