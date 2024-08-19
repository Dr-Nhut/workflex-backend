"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Offer extends Model {
        static associate(models) {
            // define association here
            this.belongsTo(models.User, {
                foreignKey: 'creatorId',
                constraints: false,
            });
            this.belongsTo(models.Job, {
                foreignKey: 'jobId',
                constraints: false,
            })

            this.hasOne(models.Contract, {
                foreignKey: 'offerId',
                constraints: false,
            })
        }
    }

    Offer.init(
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
            },
            price: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            description: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            plan: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            dateEnd: {
                type: DataTypes.DATE,
                validate: {
                    isAfter: new Date().toString(),
                }
            },
            status: {
                type: DataTypes.ENUM,
                defaultValue: "0",
                values: ["0", "1"]
            }
        },
        {
            sequelize,
            modelName: "Offer",
        }
    );

    return Offer;
};
