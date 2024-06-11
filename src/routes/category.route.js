const express = require('express');
const CategoryController = require('../controllers/CategoryController');
const validateUUID = require('../middlewares/validateUUIDv4');
const categoryRouter = express.Router();


categoryRouter
    .route("/")
    .get(CategoryController.getAll)
    .post(CategoryController.create);

categoryRouter
    .route("/:id")
    .put(validateUUID, CategoryController.update)
    .delete(validateUUID, CategoryController.delete);
// categoryRouter.get("/all/:userId", CategoryController.getAllByUser);

module.exports = categoryRouter;