const express = require('express');
const UserController = require('../controllers/UserController');
const AuthController = require('../controllers/AuthController');
const router = express.Router();
const uploadAvatar = require('../config/uploadAvatar.config')

router.get("/all", UserController.getAllAcccount);
router.get("/allFreelancers", UserController.getAllFreelancers);
router.get("/freelancer", UserController.getFreelancerInfor);
router.get("/:id", UserController.getInfor);
router.patch("/update-avatar", AuthController.getUserId, uploadAvatar.single('avatar'), UserController.updateAvatar);

router.patch("/update-infor", AuthController.getUserId, UserController.updateInfor);

module.exports = router;