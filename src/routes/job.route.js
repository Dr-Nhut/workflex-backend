const express = require('express');
const JobController = require('../controllers/JobController');
const router = express.Router();
const { catchAsyncError } = require('../utils/catchAsyncError');
const { authentication } = require('../utils/auth/authUtils');

// router.get("/pending-jobs", JobController.getPendingJob);
// router.get("/bidding-jobs", JobController.getBiddingJob);
// router.get("/bidnlock-jobs", JobController.getBiddingAndLockingJob);
// router.get("/refused-jobs", JobController.getRefusedJob);
// router.get("/employer-current-jobs", JobController.getEmployerJob)
// router.get("/freelancer-current-jobs", JobController.getFreelancerJob)
// router.get("/freelancer-completed-and-fail-jobs", JobController.getFreelancerCompletedAndFailJob)
// router.get("/freelancer-current-and-fail-jobs", JobController.getFreelancerCurrentAndFailJob)
// // router.get("/freelancer-current-jobs-v2", JobController.getFreelancerCurrentJobs)
router.get("/:id", catchAsyncError(JobController.getById));
router.get("/", catchAsyncError(JobController.getAll));

router.post("/", authentication, catchAsyncError(JobController.create));

router.patch('/:id', authentication, catchAsyncError(JobController.update));
router.delete('/:id', authentication, catchAsyncError(JobController.delete));

module.exports = router;