const express = require('express');
const permissionRouter = express.Router();
const PermissionController = require('../controllers/PermissionController');
const validateUUID = require('../middlewares/validateUUIDv4');
const { catchAsyncError } = require('../utils/catchAsyncError');
const { authentication, canAccess } = require('../utils/auth/authUtils');


permissionRouter
    .route("/")
    .post(authentication, canAccess('add-permission'), catchAsyncError(PermissionController.create));

module.exports = permissionRouter;