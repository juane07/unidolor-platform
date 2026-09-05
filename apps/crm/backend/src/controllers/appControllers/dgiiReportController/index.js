const prisma = require('@/db/prisma');
const createCRUDController = require('@/controllers/middlewaresControllers/createCRUDController');

const methods = createCRUDController('DgiiReport');

function pad(n) { return String(n).padStart(2, '0'); }

methods.generate = async (req, res) => {
  try {
    const { tipo, mes, anno } = req.body;
    if (!tipo || !mes || !anno) return res.status(400).json({ success: false, message: 'tipo, mes, anno required' });

    const startDate = new Date(anno, mes - 1, 1);
    const endDate = new Date(anno, mes, 0, 23, 59, 59);

    let data = [];
    let totalRecords = 0;
    let totalAmount = 0;

    if (tipo === '608') {
      const invoices = await prisma.invoice.findMany({
        where: {
          removed: false,
          date: { gte: startDate, lte: endDate },
          status: { not: 'cancelled' },
        },
        include: { client: true },
      });

      data = invoices.map((inv) => ({
        ncf: inv.ncf || '',
        ncfTipo: inv.ncfTipo || '01',
        regimen: inv.regimen || 'RST',
        rnc: inv.client?.identityNumber || '',
        cliente: inv.client?.name || '',
        fecha: inv.date,
        numero: inv.number,
        subtotal: inv.subTotal,
        itbis: inv.taxTotal,
        total: inv.total,
      }));
      totalRecords = invoices.length;
      totalAmount = invoices.reduce((s, i) => s + (i.total || 0), 0);
    } else if (tipo === '606') {
      return res.status(200).json({ success: true, message: 'Reporte 606 pendiente de implementar (compras)' });
    } else if (tipo === '607') {
      const whs = await prisma.withholding.findMany({
        where: {
          removed: false,
          date: { gte: startDate, lte: endDate },
        },
        include: { client: true },
      });
      data = whs.map((w) => ({
        ncf: w.ncf || '',
        tipo: w.tipo,
        rnc: w.client?.identityNumber || '',
        cliente: w.client?.name || '',
        base: w.baseAmount,
        porcentaje: w.percentage,
        monto: w.amount,
        fecha: w.date,
      }));
      totalRecords = whs.length;
      totalAmount = whs.reduce((s, w) => s + (w.amount || 0), 0);
    } else if (tipo === '609') {
      const invoices = await prisma.invoice.findMany({
        where: {
          removed: false,
          date: { gte: startDate, lte: endDate },
          status: 'cancelled',
        },
        include: { client: true },
      });
      data = invoices.map((inv) => ({
        ncf: inv.ncf || '',
        ncfTipo: inv.ncfTipo || '01',
        rnc: inv.client?.identityNumber || '',
        cliente: inv.client?.name || '',
        fecha: inv.date,
        total: inv.total,
      }));
      totalRecords = invoices.length;
      totalAmount = invoices.reduce((s, i) => s + (i.total || 0), 0);
    }

    const filename = `${tipo}_${anno}${pad(mes)}.json`;
    const reportData = { tipo, mes, anno, data, totalRecords, totalAmount, filename, status: 'generated', updated: new Date() };

    const existing = await prisma.dgiiReport.findFirst({ where: { tipo, mes, anno, removed: false } });
    let result;
    if (existing) {
      result = await prisma.dgiiReport.update({ where: { id: existing.id }, data: reportData });
    } else {
      result = await prisma.dgiiReport.create({ data: reportData });
    }

    return res.status(200).json({ success: true, result, message: `Reporte ${tipo} generado: ${totalRecords} registros` });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = methods;
