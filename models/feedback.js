"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Feedback extends Model {
        static associate(models) {
            // define association here
            this.belongsTo(models.User, {
                foreignKey: 'senderId',
                constraints: false,
            })

            this.belongsTo(models.User, {
                foreignKey: 'receiverId',
                constraints: false,
            })

            this.belongsTo(models.Job, {
                foreignKey: 'jobId',
                constraints: false,
            })
        }
    }

    Feedback.init(
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
            },
            star: {
                type: DataTypes.INTEGER,
                allowNull: false,
                validate: {
                    min: 1,
                    max: 5
                }
            },
            review: {
                type: DataTypes.STRING,
                allowNull: false,
            }
        },
        {
            sequelize,
            modelName: "Feedback",
        }
    );

    return Feedback;
};
