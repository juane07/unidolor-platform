const prisma = require('@/db/prisma');
const createCRUDController = require('@/controllers/middlewaresControllers/createCRUDController');

function modelController() {
  const methods = createCRUDController('Service');

  methods.search = async (req, res) => {
    const fieldsArray = req.query.fields ? req.query.fields.split(',') : ['name'];
    const where = {
      removed: false,
      isActive: true,
      OR: fieldsArray.map((field) => ({
        [field]: { contains: req.query.q || '', mode: 'insensitive' },
      })),
    };

    const results = await prisma.service.findMany({
      where,
      take: 20,
      select: { id: true, name: true, cupsCode: true },
    });

    if (results.length >= 1) {
      return res.status(200).json({
        success: true,
        result: results,
        message: 'Successfully found all documents',
      });
    }
    return res.status(202).json({
      success: false,
      result: [],
      message: 'No document found by this request',
    }).end();
  };

  methods.detail = async (req, res) => {
    try {
      const { id } = req.params;

      const service = await prisma.service.findFirst({ where: { id, removed: false } });
      if (!service) {
        return res.status(404).json({ success: false, message: 'Servicio no encontrado' });
      }

      const [invoices, appointments] = await Promise.all([
        prisma.invoice.findMany({
          where: {
            removed: false,
            items: { path: '$', array_contains: [{ service: id }] },
          },
          include: {
            client: { select: { name: true, identity_number: true, phone: true } },
            branch: { select: { name: true } },
            doctor: { select: { name: true } },
          },
          orderBy: { date: 'desc' },
          take: 50,
        }),
        prisma.appointment.findMany({
          where: {
            removed: false,
            serviceName: service.name,
          },
          include: {
            client: { select: { name: true, phone: true } },
            doctor: { select: { name: true, specialty: true } },
            branch: { select: { name: true } },
            opportunity: { select: { service: true, stage: true } },
          },
          orderBy: { date: 'desc' },
          take: 50,
        }),
      ]);

      const invoiceItems = [];
      invoices.forEach((inv) => {
        inv.items.forEach((item) => {
          if (item.service === id) {
            invoiceItems.push({
              invoiceId: inv.id,
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

      const stats = {
        totalInvoices: invoices.length,
        totalQuantitySold: invoiceItems.reduce((sum, item) => sum + (item.quantity || 0), 0),
        totalRevenue: invoiceItems.reduce((sum, item) => sum + (item.total || 0), 0),
        totalAppointments: appointments.length,
        upcomingAppointments: appointments.filter((a) => a.status === 'programada' && new Date(a.date) >= new Date()).length,
      };

      return res.status(200).json({
        success: true,
        result: { service, invoices: invoiceItems, appointments, stats },
        message: 'Detalle de servicio obtenido correctamente',
      });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  };

  return methods;
}

module.exports = modelController();
