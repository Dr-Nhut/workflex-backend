const express = require('express');
const AdminController = require('../controllers/AdminController');
const router = express.Router();

router.patch("/block-account/:id", AdminController.blockAccount);
router.post("/approval-job/:id", AdminController.approvalJob);
router.get("/checkSchedule", AdminController.checkSchedule);

module.exports = router;