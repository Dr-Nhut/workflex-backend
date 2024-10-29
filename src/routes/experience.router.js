const express = require('express');
const experienceRouter = express.Router();
const ExperienceController = require('../controllers/ExperienceController');
const { catchAsyncError } = require('../utils/catchAsyncError');
const { authentication, canAccess } = require('../utils/auth/authUtils');

experienceRouter
    .route("/")
    .get(catchAsyncError(ExperienceController.getAll))

experienceRouter
    .route("/")
    .post(authentication, canAccess('add-experience'), catchAsyncError(ExperienceController.create));

module.exports = experienceRouter;