const mongoose = require('mongoose');

const NcfSequence = mongoose.model('NcfSequence');

/**
 * Reserva atómica del siguiente NCF (single-writer, RF-012, RNF-I2).
 *
 * Usa findOneAndUpdate + $inc en una única operación de escritura para
 * garantizar que dos peticiones concurrentes nunca obtengan el mismo
 * número de NCF. $expr impide superar rangoHasta.
 *
 * @param {string} tipo Tipo NCF (01-04, 11...)
 * @param {string|null} branch ObjectId de sucursal (opcional)
 * @returns {Promise<{ncf: string, tipo: string, regimen: string, secuenciaActual: number}>}
 * @throws {Error} si no hay secuencia activa, está agotada o vencida
 */
async function nextNcf(tipo, branch) {
  if (!tipo) throw new Error('tipo de NCF requerido');

  const filter = { tipo, isActive: true, enabled: true, removed: false };
  if (branch) filter.branch = branch;
  else filter.branch = { $exists: false };

  const hoy = new Date();
  filter.$and = [
    { $expr: { $lt: ['$secuenciaActual', '$rangoHasta'] } },
    {
      $or: [
        { vigenciaHasta: { $exists: false } },
        { vigenciaHasta: null },
        { vigenciaHasta: { $gte: hoy } },
      ],
    },
  ];

  const seq = await NcfSequence.findOneAndUpdate(
    filter,
    { $inc: { secuenciaActual: 1 }, $set: { updated: Date.now() } },
    { new: true }
  );

  if (!seq) {
    throw new Error(`NCF ${tipo}: sin secuencia activa, agotada o vencida`);
  }

  return {
    ncf: `${seq.tipo}${String(seq.secuenciaActual).padStart(8, '0')}`,
    tipo: seq.tipo,
    regimen: seq.regimen || 'RST',
    secuenciaActual: seq.secuenciaActual,
  };
}

module.exports = { nextNcf };