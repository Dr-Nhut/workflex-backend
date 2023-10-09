const express = require('express');
const AuthController = require('../controllers/AuthController');
const router = express.Router();

router.post("/register", AuthController.checkUserExisted, AuthController.registerUser, AuthController.registerFreelancer);


module.exports = router;