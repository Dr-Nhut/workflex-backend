const express = require('express');
const CategoryController = require('../controllers/CategoryController');
const router = express.Router();

router.get("/all", CategoryController.getAll);
router.get("/all/:userId", CategoryController.getAllByUser);

router.post("/", CategoryController.create);


module.exports = router;