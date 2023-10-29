const express = require('express');
const StripeController = require('../controllers/StripeController');
const router = express.Router();

router.post('/checkout-session/:jobId', StripeController.getCheckoutSession);



module.exports = router;