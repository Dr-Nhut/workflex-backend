const express = require('express');
const OfferController = require('../controllers/OfferController');
const router = express.Router();

router.get('/for-job', OfferController.getOffersJob);
router.get('/by-freelancer', OfferController.getOffersByFreelancer);

router.post("/", OfferController.createOffer);



module.exports = router;