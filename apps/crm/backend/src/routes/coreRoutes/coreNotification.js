const express = require('express');

const router = express.Router();

const { catchErrors } = require('@/handlers/errorHandlers');
const notificationController = require('@/controllers/coreControllers/notificationController');

router.route('/notification/listUnread').get(catchErrors(notificationController.listUnread));
router.route('/notification/markRead/:id').patch(catchErrors(notificationController.markRead));
router.route('/notification/markAllRead').patch(catchErrors(notificationController.markAllRead));

module.exports = router;
