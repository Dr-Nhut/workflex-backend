const express = require('express');
const TaskController = require('../controllers/TaskController');
const router = express.Router();
const upload = require('../config/upload.config');

router.get('/all', TaskController.getAllTasks)
router.get('/documents', TaskController.getDocuments)
router.get('/:contractId', TaskController.getContractTasks);

router.post('/:id/upload-file', upload.single('image'), TaskController.uploadFile);
router.post('/', TaskController.createTask)

router.patch('/:id', TaskController.updateTask)


module.exports = router;