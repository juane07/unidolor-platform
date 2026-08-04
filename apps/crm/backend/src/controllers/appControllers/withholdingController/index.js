const mongoose = require('mongoose');
const createCRUDController = require('@/controllers/middlewaresControllers/createCRUDController');

const methods = createCRUDController('Withholding');

const Withholding = mongoose.model('Withholding');
const NcfSequence = mongoose.model('NcfSequence');

const TIPO_PORCENTAJE = {
  ITBIS: 18,
  ISR: 10,
};

methods.create = async (req, res) => {
  try {
    const { tipo, baseAmount, percentage, invoice, branch } = req.body;
    if (!tipo || baseAmount === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Campos requeridos: tipo (ITBIS|ISR), baseAmount',
      });
    }
    if (!['ITBIS', 'ISR'].includes(tipo)) {
      return res.status(400).json({ success: false, message: 'tipo debe ser ITBIS o ISR' });
    }

    const pct = percentage ?? TIPO_PORCENTAJE[tipo];
    const amount = Number((baseAmount * (pct / 100)).toFixed(2));

    let ncf;
    if (tipo === 'ITBIS') {
      const filter = { tipo: '04', isActive: true, enabled: true, removed: false };
      if (branch) filter.branch = branch;
      else filter.branch = { $exists: false };
      const sequence = await NcfSequence.findOne(filter);
      if (sequence && sequence.secuenciaActual < sequence.rangoHasta) {
        const nextNum = sequence.secuenciaActual + 1;
        ncf = `${sequence.tipo}${String(nextNum).padStart(8, '0')}`;
        await NcfSequence.findByIdAndUpdate(sequence._id, { secuenciaActual: nextNum, updated: Date.now() });
      }
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
