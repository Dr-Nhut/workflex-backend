const express = require('express');
const SkillController = require('../controllers/SkillController');
const router = express.Router();

router.get("/all", SkillController.getAll);

router.post("/", SkillController.create);


module.exports = router;