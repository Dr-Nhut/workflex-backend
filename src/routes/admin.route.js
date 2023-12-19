const express = require('express');
const AdminController = require('../controllers/AdminController');
const RecommendationController = require('../controllers/RecommendationController');
const router = express.Router();

router.patch("/block-account/:id", AdminController.blockAccount);
router.post("/approval-job/:id", AdminController.approvalJob, RecommendationController.getFreelancerForSendEmail, AdminController.sendMailRecommendation);
router.get("/checkSchedule", AdminController.checkSchedule);

module.exports = router;