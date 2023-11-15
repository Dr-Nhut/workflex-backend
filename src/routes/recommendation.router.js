const express = require('express');
const RecommendationController = require('../controllers/RecommendationController');
const AuthController = require('../controllers/AuthController');
const router = express.Router();

router.get('/', RecommendationController.getFreelancerForNewJob);
router.get('/jobs-for-freelancer', AuthController.getUserId, RecommendationController.getJobsThroughOfferForFreelancer, RecommendationController.getJobsThroughCategory, RecommendationController.getNewJobs);

module.exports = router;