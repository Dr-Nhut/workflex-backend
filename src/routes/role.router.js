const express = require('express');
const roleRouter = express.Router();
const RoleController = require('../controllers/RoleController');
const { catchAsyncError } = require('../utils/catchAsyncError');
const { authentication, canAccess } = require('../utils/auth/authUtils');

roleRouter
    .route("/")
    .get(catchAsyncError(RoleController.getAllExceptAdmin))
// .post(authentication, catchAsyncError(RoleController.create));

roleRouter
    .route("/add-permission")
    .post(authentication, canAccess('add-permission-for-role'), catchAsyncError(RoleController.addPermission));

module.exports = roleRouter;