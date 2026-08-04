const express = require('express');
const { catchErrors } = require('@/handlers/errorHandlers');
const router = express.Router();

// TEST ROUTE
router.get('/test-detail', catchErrors(async (req, res) => {
  res.json({ success: true, message: 'Test detail route works' });
}));

const appControllers = require('@/controllers/appControllers');
const { routesList } = require('@/models/utils');

const routerApp = (entity, controller) => {
  router.route(`/${entity}/create`).post(catchErrors(controller['create']));
  router.route(`/${entity}/read/:id`).get(catchErrors(controller['read']));
  router.route(`/${entity}/update/:id`).patch(catchErrors(controller['update']));
  router.route(`/${entity}/delete/:id`).delete(catchErrors(controller['delete']));
  router.route(`/${entity}/search`).get(catchErrors(controller['search']));
  router.route(`/${entity}/list`).get(catchErrors(controller['list']));
  router.route(`/${entity}/listAll`).get(catchErrors(controller['listAll']));
  router.route(`/${entity}/filter`).get(catchErrors(controller['filter']));
  router.route(`/${entity}/summary`).get(catchErrors(controller['summary']));

  if (entity === 'invoice' || entity === 'quote' || entity === 'payment') {
    router.route(`/${entity}/mail`).post(catchErrors(controller['mail']));
  }

  if (entity === 'quote') {
    router.route(`/${entity}/convert/:id`).get(catchErrors(controller['convert']));
  }
};

routesList.forEach(({ entity, controllerName }) => {
  const controller = appControllers[controllerName];
  routerApp(entity, controller);
});

// Custom detail routes
const clientController = appControllers['clientController'];
if (clientController && clientController.detail) {
  router.route('/client/detail/:id').get(clientController['detail']);
}

const serviceController = appControllers['serviceController'];
if (serviceController && serviceController.detail) {
  router.route('/service/detail/:id').get(serviceController['detail']);
}

const ncfSequenceController = appControllers['ncfSequenceController'];
if (ncfSequenceController && ncfSequenceController.next) {
  router.route('/ncfsequence/next').post(catchErrors(ncfSequenceController['next']));
}
if (ncfSequenceController && ncfSequenceController.seedDefault) {
  router.route('/ncfsequence/seed').post(catchErrors(ncfSequenceController['seedDefault']));
}

const eCFController = appControllers['eCFController'];
if (eCFController && eCFController.submit) {
  router.route('/ecf/submit').post(catchErrors(eCFController['submit']));
}

const dgiiReportController = appControllers['dgiiReportController'];
if (dgiiReportController && dgiiReportController.generate) {
  router.route('/dgiireport/generate').post(catchErrors(dgiiReportController['generate']));
}

const doctorScheduleController = appControllers['doctorScheduleController'];
if (doctorScheduleController) {
  router.route('/schedule/create').post(catchErrors(doctorScheduleController['create']));
  router.route('/schedule/list').get(catchErrors(doctorScheduleController['list']));
  router.route('/schedule/read/:id').get(catchErrors(doctorScheduleController['read']));
  router.route('/schedule/update/:id').patch(catchErrors(doctorScheduleController['update']));
  router.route('/schedule/delete/:id').delete(catchErrors(doctorScheduleController['remove']));
  router.route('/schedule/available').get(catchErrors(doctorScheduleController['getAvailableSlots']));
  router.route('/schedule/available/:doctorId').get(catchErrors(doctorScheduleController['getAvailableForDoctor']));
  router.route('/schedule/seed-bethania').post(catchErrors(doctorScheduleController['seedBethania']));
}

module.exports = router;
