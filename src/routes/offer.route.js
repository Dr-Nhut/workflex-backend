const express = require('express');
const OfferController = require('../controllers/OfferController');
const router = express.Router();

router.get('/processing-by-job', OfferController.getProcessingOffer)
router.get('/for-job', OfferController.getOffersJob);
router.get('/by-freelancer', OfferController.getOffersByFreelancer);
router.get('/all/by-freelancer', OfferController.getAllOffersByFreelancer);

router.post("/", OfferController.createOffer);
router.patch('/:id', OfferController.update);
router.delete('/:id', OfferController.delete);

module.exports = router;