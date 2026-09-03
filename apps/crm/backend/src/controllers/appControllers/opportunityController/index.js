const prisma = require('@/db/prisma');
const createCRUDController = require('@/controllers/middlewaresControllers/createCRUDController');
const { validarTransicion } = require('@/utils/stateMachine');

const MAPEO_ETAPAS_ANTERIORES = {
  cotizacion: 'cotizacion_autorizacion',
  cita_solicitada: 'recepcion_informacion',
  cita_programada: 'programacion',
  visita: 'ejecucion',
  orden_servicio: 'preparacion',
  factura: 'facturacion',
};

function normalizarEtapa(stage) {
  if (!stage) return null;
  if (MAPEO_ETAPAS_ANTERIORES[stage]) return MAPEO_ETAPAS_ANTERIORES[stage];
  return stage;
}

function modelController() {
  const methods = createCRUDController('Opportunity');

  methods.create = async (req, res) => {
    const stage = normalizarEtapa(req.body.stage || 'solicitud');
    req.body.stage = stage;
    req.body.stageHistory = [
      { from: null, to: stage, at: new Date(), by: req.user?.id || null },
    ];
    return createCRUDController('Opportunity').create(req, res);
  };

  methods.update = async (req, res) => {
    const { id } = req.params;
    const existing = await prisma.opportunity.findFirst({ where: { id, removed: false } });
    if (!existing) {
      return res.status(404).json({ success: false, result: null, message: 'No document found' });
    }

    if (req.body.stage) {
      const to = normalizarEtapa(req.body.stage);
      const from = existing.stage;
      const error = validarTransicion(from, to);
      if (error) {
        return res.status(400).json({ success: false, result: null, message: error });
      }
      req.body.stage = to;
      const history = existing.stageHistory || [];
      history.push({ from, to, at: new Date(), by: req.user?.id || null });
      req.body.stageHistory = history;
    }

    req.body.removed = false;
    const result = await prisma.opportunity.update({
      where: { id, removed: false },
      data: req.body,
    });
    if (!result) {
      return res.status(404).json({ success: false, result: null, message: 'No document found' });
    }
    return res.status(200).json({ success: true, result, message: 'we update this document ' });
  };

  return methods;
}

module.exports = modelController();
