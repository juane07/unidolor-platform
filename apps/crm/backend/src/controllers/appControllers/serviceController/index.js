const mongoose = require('mongoose');
const createCRUDController = require('@/controllers/middlewaresControllers/createCRUDController');

function modelController() {
  const Model = mongoose.model('Service');
  const methods = createCRUDController('Service');

  methods.search = async (req, res) => {
    const fieldsArray = req.query.fields ? req.query.fields.split(',') : ['name'];
    const fields = { $or: [] };
    for (const field of fieldsArray) {
      fields.$or.push({ [field]: { $regex: new RegExp(req.query.q, 'i') } });
    }
    let results = await Model
      .find({ ...fields })
      .where('removed', false)
      .where('enabled', true)
      .select('_id name cupsCode')
      .limit(20)
      .exec();
    if (results.length >= 1) {
      return res.status(200).json({
        success: true,
        result: results,
        message: 'Successfully found all documents',
      });
    } else {
      return res.status(202).json({
        success: false,
        result: [],
        message: 'No document found by this request',
      }).end();
    }
  };

  // GET /api/service/detail/:id - Vista detalle del servicio
  methods.detail = async (req, res) => {
    try {
      const { id } = req.params;
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ success: false, message: 'ID inválido' });
      }

      const service = await Model.findOne({ _id: id, removed: false }).lean();
      if (!service) {
        return res.status(404).json({ success: false, message: 'Servicio no encontrado' });
      }

      // Agregaciones: facturas y citas que usan este servicio - con límites
      const [
        invoices,
        appointments,
      ] = await Promise.all([
        // Facturas que contienen este servicio en items
        mongoose.model('Invoice')
          .find({
            removed: false,
            'items.service': id,
          })
          .populate('client', 'name identity_number phone')
          .populate('branch', 'name')
          .populate('doctor', 'name')
          .sort({ date: -1 })
          .limit(50)
          .lean(),

        // Citas que usan este servicio (por opportunity.service que referencia el nombre)
        mongoose.model('Appointment')
          .find({
            removed: false,
            'opportunity.service': service.name,
          })
          .populate('client', 'name phone')
          .populate('doctor', 'name specialty')
          .populate('branch', 'name')
          .populate('opportunity', 'service stage')
          .sort({ date: -1 })
          .limit(50)
          .lean(),
      ]);

      // Extraer items de factura específicos de este servicio
      const invoiceItems = [];
      invoices.forEach(inv => {
        inv.items.forEach(item => {
          if (item.service && item.service.toString() === id) {
            invoiceItems.push({
              invoiceId: inv._id,
              invoiceNumber: inv.number,
              invoiceYear: inv.year,
              invoiceDate: inv.date,
              client: inv.client,
              branch: inv.branch,
              doctor: inv.doctor,
              quantity: item.quantity,
              price: item.price,
              total: item.total,
              status: inv.status,
            });
          }
        });
      });

      // Estadísticas
      const stats = {
        totalInvoices: invoices.length,
        totalQuantitySold: invoiceItems.reduce((sum, item) => sum + (item.quantity || 0), 0),
        totalRevenue: invoiceItems.reduce((sum, item) => sum + (item.total || 0), 0),
        totalAppointments: appointments.length,
        upcomingAppointments: appointments.filter(a => a.status === 'programada' && new Date(a.date) >= new Date()).length,
      };

      return res.status(200).json({
        success: true,
        result: {
          service,
          invoices: invoiceItems,
          appointments,
          stats,
        },
        message: 'Detalle de servicio obtenido correctamente',
      });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  };

  return methods;
}

module.exports = modelController();