const express = require('express');
const CategoryController = require('../controllers/CategoryController');
const AuthController = require('../controllers/AuthController');
const validateUUID = require('../middlewares/validateUUIDv4');
const { catchAsyncError } = require('../utils/catchAsyncError');
const categoryRouter = express.Router();


categoryRouter
    .route("/")
    .get(catchAsyncError(CategoryController.getAll))
    .post(catchAsyncError(CategoryController.create));

categoryRouter
    .route("/:id")
    .put(validateUUID, catchAsyncError(CategoryController.update))
    .delete(validateUUID, catchAsyncError(CategoryController.delete));
// categoryRouter.get("/all/:userId", CategoryController.getAllByUser);

module.exports = categoryRouter;