const express = require('express');
const TaskController = require('../controllers/TaskController');
const router = express.Router();
const upload = require('../config/upload.config');
const { catchAsyncError } = require('../utils/catchAsyncError');
const { authentication } = require('../utils/auth/authUtils');

router.get('/all', TaskController.getAllTasks)
router.get('/documents', TaskController.getDocuments)
router.get('/:contractId', authentication, catchAsyncError(TaskController.getByContractId));

router.post('/:id/upload-file', upload.single('image'), TaskController.uploadFile);

router.post('/', authentication, catchAsyncError(TaskController.create))

router.patch('/:id', authentication, catchAsyncError(TaskController.update))

router.delete('/:id', authentication, catchAsyncError(TaskController.delete))

module.exports = router;