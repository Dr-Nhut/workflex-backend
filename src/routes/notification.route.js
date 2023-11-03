const express = require('express');
const NotificationController = require('../controllers/NotificationController');
const router = express.Router();

router.get('/:userId', NotificationController.getNotifications)

router.post("/", NotificationController.create);
router.patch("/:id", NotificationController.update);



module.exports = router;