const express = require('express');

const router = express.Router();

const { catchErrors } = require('@/handlers/errorHandlers');
const webhookController = require('@/controllers/coreControllers/webhookController');

router.route('/webhook/bot').post(catchErrors(webhookController.handleBotWebhook));
router.route('/webhook/case').post(catchErrors(webhookController.handleCreateCase));

module.exports = router;
