const express = require('express');
const UserController = require('../controllers/UserController');
const router = express.Router();

router.get("/:id", UserController.getInfor);

module.exports = router;