const express = require('express');
const SkillController = require('../controllers/SkillController');
const router = express.Router();

router.get("/all", SkillController.getAll);
router.get("/all/:userId", SkillController.getAllByUser);

router.post("/", SkillController.create);
router.delete("/", SkillController.deleteSkill);


module.exports = router;