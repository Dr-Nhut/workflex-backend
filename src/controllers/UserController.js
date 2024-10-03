const crypto = require('crypto');
const conn = require('../config/db.config');
const { OK } = require('../core/success.reponse');
const UserServices = require('../services/user.services');


class UserController {
    getAllAcccount(req, res) {
        const ADMIN = 'adm'
        const sql = `SELECT id, fullname, avatar, email, role, status FROM user WHERE role != '${ADMIN}';`
        conn.promise().query(sql)
            .then(([rows, fields]) => {
                res.json(rows)
            })
            .catch(err => console.error(err));
    }

    getAllFreelancers(req, res) {
        const sql = `SELECT id, fullname, avatar, email, role, status FROM user WHERE role='fre';`
        conn.promise().query(sql)
            .then(([rows, fields]) => {
                res.json(rows)
            })
            .catch(err => console.error(err));
    }

    getAllFreelancersByCategory(req, res) {
        const categoryId = req.query.categoryId;
        const sql = `SELECT user.id FROM usercategory LEFT JOIN user ON usercategory.userId=user.id WHERE categoryId='${categoryId}' AND user.role='fre'`;

        conn.promise().query(sql)
            .then(([rows, fields]) => res.json(rows))
            .catch((err) => console.error(err));
    }

    getInfor(req, res) {
        const userId = req.params.id;

        conn.promise().query(`SELECT fullname, avatar, email, role, bio FROM user WHERE user.id='${userId}'`)
            .then(([rows, fields]) => {
                res.json(rows[0])
            })
            .catch((err) => console.error(err));
    }

    async updateAvatar(req, res) {
        console.log(req.file)
        return OK.create({
            message: 'Cập nhật ảnh đại diện thành công!',
            metadata: await UserServices.updateAvatar({ userId: req.user.id, path: req.file.path })
        }).send(res);
    }

    updateInfor(req, res) {
        const userId = req.userId;

        const { fullname = null, email = null, address = null, bio = null, bank_account = null, sex = null } = req.body;

        const sql = `UPDATE user SET fullname = IFNULL(?, fullname), email = IFNULL(?, email), address = IFNULL(?, address), bio = IFNULL(?, bio), bank_account = IFNULL(?, bank_account), sex = IFNULL(?, sex) WHERE id='${userId}';`
        conn.promise().query(sql, [fullname, email, address, bio, bank_account, sex])
            .then(() => res.json({ message: 'Thông tin user đã được thay đổi' }))
            .catch((err) => console.log(err));
    }


    getFreelancerInfor(req, res) {
        const id = req.query.freelancerId;

        console.log(id);


        const sql = `SELECT id, fullname, avatar, address, bio FROM user WHERE id='${id}';`

        console.log(sql);

        conn.promise().query(sql)
            .then(([rows, fields]) => {
                res.json(rows[0])
            })
            .catch(err => console.log(err))
    }
}

module.exports = new UserController;