"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Task extends Model {
        static associate(models) {
            // define association here
            this.belongsTo(models.Contract, {
                foreignKey: 'contractId',
                constraints: false,
            })

            this.belongsTo(models.User, {
                foreignKey: 'creatorId',
                constraints: false,
            })
        }
    }

    Task.init({
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        dateStart: {
            type: DataTypes.DATE,
            validate: {
                isAfter: new Date().toString(),
            },
            allowNull: false,
        },
        dateEnd: {
            type: DataTypes.DATE,
            validate: {
                isAfter(value) {
                    if (value <= this.dateStart) {
                        throw new Error('End date must be after start date!');
                    }
                }

            },
            allowNull: false,
        },
        status: {
            type: DataTypes.ENUM,
            defaultValue: "0",
            values: ["0", "1", "2", "3"],
            allowNull: false,
        }
    }, {
        sequelize,
        modelName: "Task",
    });

    return Task;
};
