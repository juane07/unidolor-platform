const prisma = require('@/db/prisma');
const createCRUDController = require('@/controllers/middlewaresControllers/createCRUDController');
const { nextNcf } = require('@/helpers/ncf');

const methods = createCRUDController('NcfSequence');

methods.next = async (req, res) => {
  try {
    const { tipo, branch } = req.body;
    if (!tipo) return res.status(400).json({ success: false, message: 'tipo is required' });

    const reservado = await nextNcf(tipo, branch || null);

    return res.status(200).json({
      success: true,
      result: {
        ncf: reservado.ncf,
        tipo: reservado.tipo,
        secuencia: reservado.secuenciaActual,
        regimen: reservado.regimen,
      },
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

methods.seedDefault = async (req, res) => {
  try {
    const branch = req.body.branch
      ? await prisma.branch.findFirst({ where: { id: req.body.branch, removed: false } })
      : await prisma.branch.findFirst({ where: { removed: false } });

    const defaults = [
      { tipo: '01', nombre: 'Factura de crédito fiscal', regimen: 'RST', rangoDesde: 10000001, rangoHasta: 10010000 },
      { tipo: '02', nombre: 'Factura de consumo', regimen: 'RST', rangoDesde: 10000001, rangoHasta: 10010000 },
      { tipo: '03', nombre: 'Nota de débito', regimen: 'RST', rangoDesde: 10000001, rangoHasta: 10010000 },
      { tipo: '04', nombre: 'Nota de crédito', regimen: 'RST', rangoDesde: 10000001, rangoHasta: 10010000 },
      { tipo: '11', nombre: 'Régimen especial (e-CF)', regimen: 'RST', rangoDesde: 10000001, rangoHasta: 10010000 },
    ];

    const created = [];
    for (const d of defaults) {
      const existing = await prisma.ncfSequence.findFirst({
        where: {
          tipo: d.tipo,
          removed: false,
          branchId: branch ? branch.id : null,
        },
      });

      if (existing) {
        created.push({ ...d, status: 'ya existía' });
        continue;
      }

      await prisma.ncfSequence.create({
        data: {
          ...d,
          branchId: branch ? branch.id : null,
          isActive: true,
          enabled: true,
          secuenciaActual: d.rangoDesde - 1,
        },
      });
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
