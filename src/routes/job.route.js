const express = require('express');
const JobController = require('../controllers/JobController');
const router = express.Router();

router.get("/pending-jobs", JobController.getPendingJob);
router.get("/bidding-jobs", JobController.getBiddingJob);
router.get("/bidnlock-jobs", JobController.getBiddingAndLockingJob);
router.get("/refused-jobs", JobController.getRefusedJob);
router.get("/employer-current-jobs", JobController.getEmployerJob)
router.get("/freelancer-current-jobs", JobController.getFreelancerJob)
// router.get("/freelancer-current-jobs-v2", JobController.getFreelancerCurrentJobs)
router.get("/all", JobController.getJobByStatus);

router.get("/:id", JobController.getDetailJob);


router.post("/create", JobController.create);

router.patch('/:id', JobController.update);


module.exports = router;