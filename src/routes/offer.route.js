const express = require('express');
const OfferController = require('../controllers/OfferController');
const { authentication } = require('../utils/auth/authUtils');
const { catchAsyncError } = require('../utils/catchAsyncError');
const router = express.Router();

router.get('/processing-by-job', OfferController.getProcessingOffer)
router.get('/for-job', OfferController.getOffersJob);
router.get('/by-freelancer', OfferController.getOffersByFreelancer);
router.get('/all/by-freelancer', OfferController.getAllOffersByFreelancer);

router.post("/:id", authentication, catchAsyncError(OfferController.create));
router.patch('/:id', OfferController.update);
router.delete('/:id', OfferController.delete);

module.exports = router;