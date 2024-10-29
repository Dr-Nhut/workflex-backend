const express = require('express');
const SkillController = require('../controllers/SkillController');
const skillRouter = express.Router();
const { catchAsyncError } = require('../utils/catchAsyncError');
const validateUUID = require('../middlewares/validateUUIDv4');

skillRouter.route("/")
    .get(catchAsyncError(SkillController.getAll))
    .post(catchAsyncError(SkillController.create))

skillRouter.route("/:id")
    .patch(validateUUID, catchAsyncError(SkillController.update))
    .delete(validateUUID, catchAsyncError(SkillController.delete));

module.exports = skillRouter;