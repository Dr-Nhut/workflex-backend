const express = require('express');
const JobController = require('../controllers/JobController');
const router = express.Router();
const { catchAsyncError } = require('../utils/catchAsyncError');
const { authentication, canAccess } = require('../utils/auth/authUtils');

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
router.get("/employer", authentication, catchAsyncError(JobController.getEmployerJob));
router.get("/", catchAsyncError(JobController.getAll));

// employer can create jobs
router.post('/:id/submit', authentication, canAccess('submit-job'), catchAsyncError(JobController.submit));
router.post('/:id/approve', authentication, canAccess('approve-job'), catchAsyncError(JobController.approve));
router.post("/", authentication, canAccess('add-job'), catchAsyncError(JobController.create));

// job can be updated when user is creator of job 
router.patch('/:id', authentication, canAccess('update-job'), catchAsyncError(JobController.update));
router.delete('/:id', authentication, canAccess('delete-job'), catchAsyncError(JobController.delete));

module.exports = router;