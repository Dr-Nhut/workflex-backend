const express = require('express');
const AuthController = require('../controllers/AuthController');
const router = express.Router();

router.get('/verify', AuthController.verifyEmail);
router.get('/userInfor', AuthController.getUser);

router.post("/send-email-verify", AuthController.checkUserExisted, AuthController.sendEmail);
router.post("/register", AuthController.registerUser);
router.post("/login", AuthController.login);

module.exports = router;