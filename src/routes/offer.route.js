const express = require('express');
const OfferController = require('../controllers/OfferController');
const { authentication } = require('../utils/auth/authUtils');
const { catchAsyncError } = require('../utils/catchAsyncError');
const router = express.Router();

router.get('/by-freelancer', authentication, catchAsyncError(OfferController.getByFreelancer));
router.get('/:jobId', authentication, catchAsyncError(OfferController.getByJob));

router.post("/:id", authentication, catchAsyncError(OfferController.create));
// router.patch('/:id', OfferController.update);
router.delete('/:id', authentication, catchAsyncError(OfferController.delete));

module.exports = router;