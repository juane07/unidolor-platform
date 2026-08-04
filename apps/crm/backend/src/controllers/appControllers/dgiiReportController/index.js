const mongoose = require('mongoose');
const createCRUDController = require('@/controllers/middlewaresControllers/createCRUDController');

const methods = createCRUDController('DgiiReport');

const Invoice = mongoose.model('Invoice');
const DgiiReport = mongoose.model('DgiiReport');

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
      const invoices = await Invoice.find({
        removed: false,
        date: { $gte: startDate, $lte: endDate },
        status: { $ne: 'cancelled' },
      }).populate('client').lean();

      data = invoices.map((inv) => ({
        ncf: inv.ncf || '',
        ncfTipo: inv.ncfTipo || '01',
        regimen: inv.regimen || 'RST',
        rnc: inv.client?.identity_number || inv.client?.rfc || '',
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
      const Withholding = mongoose.model('Withholding');
      const whs = await Withholding.find({ removed: false, date: { $gte: startDate, $lte: endDate } }).populate('client').lean();
      data = whs.map((w) => ({
        ncf: w.ncf || '',
        tipo: w.tipo,
        rnc: w.client?.identity_number || w.client?.rfc || '',
        cliente: w.client?.name || '',
        base: w.baseAmount,
        porcentaje: w.percentage,
        monto: w.amount,
        fecha: w.date,
      }));
      totalRecords = whs.length;
      totalAmount = whs.reduce((s, w) => s + (w.amount || 0), 0);
    } else if (tipo === '609') {
      const invoices = await Invoice.find({
        removed: false,
        date: { $gte: startDate, $lte: endDate },
        status: 'cancelled',
      }).populate('client').lean();

      data = invoices.map((inv) => ({
        ncf: inv.ncf || '',
        ncfTipo: inv.ncfTipo || '01',
        rnc: inv.client?.identity_number || inv.client?.rfc || '',
        cliente: inv.client?.name || '',
        fecha: inv.date,
        total: inv.total,
      }));
      totalRecords = invoices.length;
      totalAmount = invoices.reduce((s, i) => s + (i.total || 0), 0);
    }

    const filename = `${tipo}_${anno}${pad(mes)}.json`;

    const reportData = { tipo, mes, anno, data, totalRecords, totalAmount, filename, status: 'generated', updated: Date.now() };

    const existing = await DgiiReport.findOne({ tipo, mes, anno, removed: false });
    let result;
    if (existing) {
      result = await DgiiReport.findByIdAndUpdate(existing._id, reportData, { new: true });
    } else {
      result = await new DgiiReport(reportData).save();
    }

    return res.status(200).json({ success: true, result, message: `Reporte ${tipo} generado: ${totalRecords} registros` });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = methods;
