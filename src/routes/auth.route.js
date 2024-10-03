const express = require('express');
const AuthController = require('../controllers/AuthController');
const router = express.Router();
const { catchAsyncError } = require('../utils/catchAsyncError');
const { authentication, authRefreshToken } = require('../utils/auth/authUtils');

router.get('/verify', catchAsyncError(AuthController.verifyEmail));
router.get('/userInfor', AuthController.getUser);

router.post("/send-email-verify", catchAsyncError(AuthController.sendEmail));
router.post("/register", catchAsyncError(AuthController.registerUser));
router.post("/login", catchAsyncError(AuthController.login));
router.post("/logout", authentication, catchAsyncError(AuthController.logout));
router.post("/refreshToken", authRefreshToken, catchAsyncError(AuthController.refreshToken));
router.post("/forgetPassword", AuthController.forgetPassword);
router.post("/resetPassword/:token", AuthController.resetPassword);
router.patch("/updatePassword", AuthController.protect, AuthController.updatePassword);

module.exports = router;