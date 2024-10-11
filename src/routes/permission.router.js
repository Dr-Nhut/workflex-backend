const express = require('express');
const permissionRouter = express.Router();
const PermissionController = require('../controllers/PermissionController');
const { catchAsyncError } = require('../utils/catchAsyncError');
const { authentication, canAccess } = require('../utils/auth/authUtils');


permissionRouter
    .route("/")
    .get(authentication, catchAsyncError(PermissionController.getAll))
    .post(authentication, canAccess('add-permission'), catchAsyncError(PermissionController.create));

module.exports = permissionRouter;