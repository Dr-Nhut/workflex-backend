const _ = require('lodash');
const { Op, where } = require("sequelize");
const { Task, Contract } = require("../../models");
const { BadRequestError, NotFoundError } = require("../core/error.response");

class TaskServices {
    static getByContractId({ contractId }) {
        /**
         * Check user belongs to contract 
         */
        const tasks = Task.findAll({
            where: {
                contractId
            }
        })

        if (!tasks) {
            throw new NotFoundError("Not found contract!");
        }

        return tasks;
    }

    static async create({ taskData, contractId, userId }) {
        const contract = await Contract.findOne({
            where: {
                id: contractId,
                [Op.or]: [
                    { freelancerId: userId },
                    { employerId: userId },
                ]
            }
        })

        if (!contract) {
            throw new BadRequestError("Couldn't find contract!");
        }

        const newTask = await Task.create({
            ...taskData,
            contractId,
            creatorId: userId
        })

        return newTask;
    }

    static async update({ taskId, taskData }) {
        const taskFilter = _.pick(taskData, ["name", "description", "dateStart", "dateEnd", "status"]);

        return await Task.update(taskFilter, {
            where: {
                id: taskId,
            },
        },);
    }

    static async delete({ taskId, userId }) {
        return await Task.destroy({
            where: {
                id: taskId,
                creatorId: userId
            }
        })
    }
}

module.exports = TaskServices;