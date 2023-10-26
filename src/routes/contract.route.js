const express = require('express');
const ContractController = require('../controllers/ContractController');
const router = express.Router();

router.get('/', ContractController.getContractByOffer)

router.post("/", ContractController.createContract);



module.exports = router;