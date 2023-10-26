const express = require('express');
const OfferController = require('../controllers/OfferController');
const router = express.Router();

router.get('/processing-by-job', OfferController.getProcessingOffer)
router.get('/for-job', OfferController.getOffersJob);
router.get('/by-freelancer', OfferController.getOffersByFreelancer);

router.post("/", OfferController.createOffer);

router.patch('/:id', OfferController.update);

module.exports = router;