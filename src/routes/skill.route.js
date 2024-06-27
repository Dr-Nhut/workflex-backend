const express = require('express');
const SkillController = require('../controllers/SkillController');
const skillRouter = express.Router();

skillRouter
    .route("/")
    .get(SkillController.getAll)
    .post(SkillController.create)

// router.get("/all/:userId", SkillController.getAllByUser);

skillRouter.route("/:id")
    .patch(SkillController.update)
    .delete(SkillController.delete);


module.exports = skillRouter;