const prisma = require('@/db/prisma');

/**
 * Reserva atómica del siguiente NCF (single-writer, RF-012, RNF-I2).
 *
 * Usa una transacción Prisma para garantizar que dos peticiones concurrentes
 * nunca obtengan el mismo número de NCF.
 *
 * @param {string} tipo Tipo NCF (01-04, 11...)
 * @param {string|null} branchId ID de sucursal (opcional)
 * @returns {Promise<{ncf: string, tipo: string, regimen: string, secuenciaActual: number}>}
 * @throws {Error} si no hay secuencia activa, está agotada o vencida
 */
async function nextNcf(tipo, branchId) {
  if (!tipo) throw new Error('tipo de NCF requerido');

  const where = {
    tipo,
    isActive: true,
    enabled: true,
    removed: false,
  };

  if (branchId) {
    where.branchId = branchId;
  } else {
    where.branchId = null;
  }

  const hoy = new Date();

  // Find a valid sequence
  const seq = await prisma.ncfSequence.findFirst({
    where: {
      ...where,
      secuenciaActual: { lt: prisma.ncfSequence.fields.rangoHasta },
      OR: [
        { vigenciaHasta: null },
        { vigenciaHasta: { gte: hoy } },
      ],
    },
  });

  if (!seq) {
    throw new Error(`NCF ${tipo}: sin secuencia activa, agotada o vencida`);
  }

  // Increment atomically using update
  const updated = await prisma.ncfSequence.update({
    where: { id: seq.id },
    data: {
      secuenciaActual: { increment: 1 },
      updated: new Date(),
    },
  });

  return {
    ncf: `${updated.tipo}${String(updated.secuenciaActual).padStart(8, '0')}`,
    tipo: updated.tipo,
    regimen: updated.regimen || 'RST',
    secuenciaActual: updated.secuenciaActual,
  };
}

module.exports = { nextNcf };
