const express = require('express');
const AuthController = require('../controllers/AuthController');
const router = express.Router();

router.get('/verify', AuthController.verifyEmail);
router.get('/userInfor', AuthController.getUser);

router.post("/send-email-verify", AuthController.checkUserExisted, AuthController.sendEmail);
router.post("/register", AuthController.registerUser);
router.post("/login", AuthController.login);
router.post("/forgetPassword", AuthController.forgetPassword);
router.post("/resetPassword/:token", AuthController.resetPassword);
router.patch("/updatePassword", AuthController.protect, AuthController.updatePassword);

module.exports = router;