const mongoose = require('mongoose');
const createCRUDController = require('@/controllers/middlewaresControllers/createCRUDController');
const { institutionalConfig } = require('@/config/institutionalConfig');
const { nextNcf } = require('@/helpers/ncf');

const methods = createCRUDController('Withholding');

const Withholding = mongoose.model('Withholding');
const Invoice = mongoose.model('Invoice');

const getRetenciones = () => {
  const cfg = institutionalConfig?.configuracionFacturacion;
  return {
    ITBIS: cfg?.itbisRetencion ?? 18,
    ISR: cfg?.isrRetencion ?? 10,
  };
};

methods.create = async (req, res) => {
  try {
    const { tipo, baseAmount, percentage, invoice, branch, exento } = req.body;
    if (!tipo || baseAmount === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Campos requeridos: tipo (ITBIS|ISR), baseAmount',
      });
    }
    if (!['ITBIS', 'ISR'].includes(tipo)) {
      return res.status(400).json({ success: false, message: 'tipo debe ser ITBIS o ISR' });
    }

    // Bloqueo ITBIS sobre operaciones exentas (RN-020, R14-A5): los servicios
    // de salud no generan ITBIS, por lo que no existe monto que retener.
    if (tipo === 'ITBIS') {
      if (exento) {
        return res.status(400).json({
          success: false,
          message: 'No se puede retener ITBIS sobre operaciones exentas (RN-020)',
        });
      }
      if (invoice) {
        const factura = await Invoice.findOne({ _id: invoice, removed: false });
        if (factura && (Number(factura.taxRate) === 0 || Number(factura.taxTotal) === 0)) {
          return res.status(400).json({
            success: false,
            message: 'La factura referenciada es exenta de ITBIS: no hay monto que retener (RN-020)',
          });
        }
      }
    }

    const TIPO_PORCENTAJE = getRetenciones();
    const pct = percentage ?? TIPO_PORCENTAJE[tipo];
    const amount = Number((baseAmount * (pct / 100)).toFixed(2));

    let ncf;
    if (tipo === 'ITBIS') {
      const reservado = await nextNcf('04', branch || null);
      ncf = reservado.ncf;
    }

    const data = {
      ...req.body,
      percentage: pct,
      amount,
      ncf: ncf || req.body.ncf,
    };
    if (invoice) data.invoice = invoice;

    const result = await Withholding.create(data);
    return res.status(201).json({
      success: true,
      result,
      message: `Retención ${tipo} creada por RD$${amount}${ncf ? ` con NCF ${ncf}` : ''}`,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = methods;
