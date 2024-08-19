"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Contract extends Model {
        static associate(models) {
            // define association here
            this.belongsTo(models.Job, {
                foreignKey: 'jobId',
                constraints: false,
            })

            this.belongsTo(models.User, {
                foreignKey: 'employerId',
                constraints: false,
            })

            this.belongsTo(models.User, {
                foreignKey: 'freelancerId',
                constraints: false,
            })

            this.belongsTo(models.User, {
                foreignKey: 'lastUserModified',
                constraints: false,
            })

            this.belongsTo(models.Offer, {
                foreignKey: 'offerId',
                constraints: false,
            })
        }
    }

    Contract.init(
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
                allowNull: false,
            },
            dateStart: {
                type: DataTypes.DATE,
                values: {
                    isAfter: new Date().toString(),
                },
                allowNull: false,
            },
            dateEnd: {
                type: DataTypes.DATE,
                values: {
                    isAfter: new Date(this.dateStart).toString(),
                },
                allowNull: false,
            },
            value: {
                type: DataTypes.INTEGER,
                values: {
                    min: 1000,
                },
                allowNull: false,
            },
            status: {
                type: DataTypes.ENUM,
                defaultValue: "0",
                values: ["0", "1", "2", "3"],
                allowNull: false,
            }
        },
        {
            sequelize,
            modelName: "Contract",
        }
    );
    return Contract;
};
