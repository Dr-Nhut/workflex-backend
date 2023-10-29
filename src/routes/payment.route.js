const express = require('express');
const PaymentController = require('../controllers/PaymentController');
const router = express.Router();

router.get('/by-offer', PaymentController.getPaymentByOffer);

module.exports = router;