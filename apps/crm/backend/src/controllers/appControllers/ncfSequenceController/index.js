const mongoose = require('mongoose');
const createCRUDController = require('@/controllers/middlewaresControllers/createCRUDController');

const methods = createCRUDController('NcfSequence');

const NcfSequence = mongoose.model('NcfSequence');

methods.next = async (req, res) => {
  try {
    const { tipo, branch } = req.body;
    if (!tipo) return res.status(400).json({ success: false, message: 'tipo is required' });

    const filter = { tipo, isActive: true, enabled: true, removed: false };
    if (branch) filter.branch = branch;
    else filter.branch = { $exists: false };

    const sequence = await NcfSequence.findOne(filter);
    if (!sequence) return res.status(404).json({ success: false, message: 'No active NCF sequence found for this tipo' });
    if (sequence.secuenciaActual >= sequence.rangoHasta) return res.status(400).json({ success: false, message: 'NCF sequence exhausted for this tipo' });

    const nextNum = sequence.secuenciaActual + 1;
    const ncf = `${sequence.tipo}${String(nextNum).padStart(8, '0')}`;

    await NcfSequence.findByIdAndUpdate(sequence._id, { secuenciaActual: nextNum, updated: Date.now() });

    return res.status(200).json({
      success: true,
      result: { ncf, tipo: sequence.tipo, secuencia: nextNum, regimen: sequence.regimen },
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

methods.seedDefault = async (req, res) => {
  try {
    const Branch = mongoose.model('Branch');
    const branch = req.body.branch
      ? await Branch.findOne({ _id: req.body.branch, removed: false })
      : await Branch.findOne({ removed: false });

    const defaults = [
      { tipo: '01', nombre: 'Factura de crédito fiscal', regimen: 'RST', rangoDesde: 10000001, rangoHasta: 10010000 },
      { tipo: '02', nombre: 'Factura de consumo', regimen: 'RST', rangoDesde: 10000001, rangoHasta: 10010000 },
      { tipo: '03', nombre: 'Nota de débito', regimen: 'RST', rangoDesde: 10000001, rangoHasta: 10010000 },
      { tipo: '04', nombre: 'Nota de crédito', regimen: 'RST', rangoDesde: 10000001, rangoHasta: 10010000 },
      { tipo: '11', nombre: 'Régimen especial (e-CF)', regimen: 'RST', rangoDesde: 10000001, rangoHasta: 10010000 },
    ];

    const created = [];
    for (const d of defaults) {
      const filter = {
        tipo: d.tipo,
        removed: false,
        branch: branch ? branch._id : { $exists: false },
      };
      const existing = await NcfSequence.findOne(filter);
      if (existing) {
        created.push({ ...d, status: 'ya existía' });
        continue;
      }
      const doc = new NcfSequence({
        ...d,
        branch: branch ? branch._id : null,
        isActive: true,
        enabled: true,
        secuenciaActual: d.rangoDesde - 1,
      });
      await doc.save();
      created.push({ ...d, status: 'creado' });
    }

    return res.status(200).json({
      success: true,
      result: created,
      message: branch
        ? `Secuencias NCF creadas para ${branch.name}`
        : 'Secuencias NCF creadas sin sucursal (global)',
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = methods;
