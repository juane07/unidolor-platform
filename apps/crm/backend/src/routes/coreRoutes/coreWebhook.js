const express = require('express');

const router = express.Router();

const { catchErrors } = require('@/handlers/errorHandlers');
const webhookController = require('@/controllers/coreControllers/webhookController');

router.route('/webhook/bot').post(catchErrors(webhookController.handleBotWebhook));

module.exports = router;
