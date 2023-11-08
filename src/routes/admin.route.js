const express = require('express');
const AdminController = require('../controllers/AdminController');
const router = express.Router();

router.post("/approval-job/:id", AdminController.approvalJob);
router.get("/checkSchedule", AdminController.checkSchedule);

module.exports = router;