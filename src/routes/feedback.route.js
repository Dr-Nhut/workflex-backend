const express = require('express');
const FeedbackController = require('../controllers/FeedbackController');
const AuthController = require('../controllers/AuthController');
const { authentication } = require('../utils/auth/authUtils');
const { catchAsyncError } = require('../utils/catchAsyncError');
const router = express.Router();

router.get('/all/:userId', FeedbackController.getAllEvaluationByUser);
router.get('/:jobId', AuthController.getUserId, FeedbackController.getEvaluation);
router.get('/', authentication, catchAsyncError(FeedbackController.getByUser))

router.post('/', authentication, catchAsyncError(FeedbackController.create));

router.patch('/:id', authentication, catchAsyncError(FeedbackController.update));

router.delete('/:id', authentication, catchAsyncError(FeedbackController.delete));

module.exports = router;