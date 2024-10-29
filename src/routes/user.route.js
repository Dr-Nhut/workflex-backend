const express = require('express');
const UserController = require('../controllers/UserController');
const AuthController = require('../controllers/AuthController');
const router = express.Router();
const uploadAvatar = require('../config/uploadAvatar.config');
const { authentication } = require('../utils/auth/authUtils');
const { catchAsyncError } = require('../utils/catchAsyncError');

router.get("/all", UserController.getAllAcccount);
router.get("/allFreelancers", UserController.getAllFreelancers);
router.get("/allFreelancersByCategory", UserController.getAllFreelancersByCategory);
router.get("/me", authentication, catchAsyncError(UserController.getMyInfor));
router.get("/freelancer", UserController.getFreelancerInfor);
router.get("/:id", UserController.getInfor);
router.patch("/change-avatar", authentication, uploadAvatar.single('avatar'), catchAsyncError(UserController.updateAvatar));
router.patch("/update-categories", authentication, catchAsyncError(UserController.updateCategories));

router.patch("/update-infor", AuthController.getUserId, UserController.updateInfor);

module.exports = router;