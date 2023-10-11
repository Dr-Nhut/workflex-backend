const express = require('express');
const AuthController = require('../controllers/AuthController');
const router = express.Router();

router.get('/verify', AuthController.verifyEmail)

router.post("/send-email-verify", AuthController.checkUserExisted, AuthController.sendEmail);
router.post("/register", AuthController.registerUser, AuthController.registerFreelancer);


module.exports = router;