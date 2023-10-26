const crypto = require('crypto');
const conn = require('../config/db.config')

class TaskController {
    getAllTasks(req, res) {
        const sql = `SELECT * FROM task WHERE contractId=${req.query.contractId}`
        conn.promise().query(sql)
            .then(([rows, fields]) => res.json(rows))
            .catch((err => console.error(err)));
    }

    getContractTasks(req, res) {
        const contractId = req.params.contractId;

        const sql = `SELECT * FROM task WHERE contractId='${contractId}'`;
        conn.promise().query(sql)
            .then(([rows, fields]) => res.json(rows))
            .catch((err => console.error(err)));
    }

    getDocuments(req, res) {
        const taskId = req.query.taskId;

        console.log(taskId);

        const sql = `SELECT * FROM document WHERE taskId='${taskId}'`;
        conn.promise().query(sql)
            .then(([rows, fields]) => res.json(rows))
            .catch((err => console.error(err)));

    }

    createTask(req, res) {
        const { name, description, contractId, dateStart, dateEnd } = req.body;
        const id = crypto.randomUUID();

        const sql = "INSERT INTO task (id, name, description, dateStart, dateEnd, contractId) VALUES(?,?,?,?,?,?);";
        conn.promise().query(sql, [id, name, description, new Date(dateStart), new Date(dateEnd), contractId])
            .then(() => {
                res.json({ status: 'success', message: 'Nhiệm vụ mới được tạo!' });
            })
            .catch(err => console.error(err));
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

    updateTask(req, res) {
        const id = req.params.id;
        const { name = null, description = null, dateStart = null, dateEnd = null, status = null } = req.body;

        const sql = `UPDATE task SET name = IFNULL(?, name), description = IFNULL(?, description), dateStart = IFNULL(?, dateStart), dateEnd = IFNULL(?, dateEnd), status = IFNULL(?, status) WHERE id='${id}';`
        conn.promise().query(sql, [name, description, dateStart, dateEnd, status])
            .then(() => res.json({ message: 'Thay đổi task thành công' }))
            .catch((err) => console.log(err));
    }
}

module.exports = new TaskController;