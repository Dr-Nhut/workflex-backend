const express = require('express');
const EvaluationController = require('../controllers/EvaluationController');
const AuthController = require('../controllers/AuthController');
const router = express.Router();

router.get('/all/:userId', EvaluationController.getAllEvaluationByUser);
router.get('/:jobId', AuthController.getUserId, EvaluationController.getEvaluation);
router.get('/checkCompleted/:jobId', EvaluationController.checkCompleted)

router.post('/:jobId', AuthController.getUserId, EvaluationController.createEvaluation);

module.exports = router;