const express = require('express');
const ContractController = require('../controllers/ContractController');
const { authentication } = require('../utils/auth/authUtils');
const { catchAsyncError } = require('../utils/catchAsyncError');
const router = express.Router();

router.get('/', authentication, catchAsyncError(ContractController.getByUser))

router.post("/", authentication, catchAsyncError(ContractController.create));

router.patch("/:id", authentication, catchAsyncError(ContractController.update));

router.delete("/:id", authentication, catchAsyncError(ContractController.delete));

module.exports = router;