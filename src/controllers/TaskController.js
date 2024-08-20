const crypto = require('crypto');
const conn = require('../config/db.config');
const { OK, Created, NoContent } = require('../core/success.reponse');
const TaskServices = require('../services/task.services');

class TaskController {
    getAllTasks(req, res) {
        const sql = `SELECT * FROM task WHERE contractId=${req.query.contractId}`
        conn.promise().query(sql)
            .then(([rows, fields]) => res.json(rows))
            .catch((err => console.error(err)));
    }

    async getByContractId(req, res) {
        const tasks = await TaskServices.getByContractId({ contractId: req.params.contractId })

        return OK.create({
            message: "success",
            metadata: {
                length: tasks.length,
                data: tasks
            }
        }).send(res);
    }

    getDocuments(req, res) {
        const taskId = req.query.taskId;

        const sql = `SELECT * FROM document WHERE taskId='${taskId}'`;
        conn.promise().query(sql)
            .then(([rows, fields]) => res.json(rows))
            .catch((err => console.error(err)));

    }

    async create(req, res) {
        return Created.create({
            message: "Task created successfully!",
            metadata: await TaskServices.create({
                taskData: req.body,
                contractId: req.body.contractId,
                userId: req.user.id
            })
        }).send(res);
    }

    uploadFile(req, res) {
        const filename = req.file.filename;
        const userId = req.body.userId;
        const taskId = req.params.id;

        if (!filename) res.send("Lỗi upload file")

        const sql = `INSERT INTO document (taskId, userId,  filename, createAt) VALUES (?, ?, ?, ?)`;
        conn.promise().query(sql, [taskId, userId, filename, new Date()])
            .then(() => {
                res.json({ status: 'success', message: 'Gửi file thành công!' });
            })
            .catch(err => console.error(err));
    }

    async update(req, res) {
        return OK.create({
            message: 'Update task successfully!',
            metadata: await TaskServices.update({
                taskId: req.params.id,
                taskData: req.body
            })
        }).send(res);
    }

    async delete(req, res) {
        await TaskServices.delete({
            taskId: req.params.id,
            userId: req.user.id
        });
        return NoContent.create().send(res);
    }
}

module.exports = new TaskController;