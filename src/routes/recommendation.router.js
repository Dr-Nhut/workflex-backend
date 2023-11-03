const express = require('express');
const RecommendationController = require('../controllers/RecommendationController');
const router = express.Router();

router.get('/', RecommendationController.getFreelancerForNewJob);

module.exports = router;