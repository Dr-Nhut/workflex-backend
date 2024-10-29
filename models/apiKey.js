'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class ApiKey extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    ApiKey.init({
        id: {
            allowNull: false,
            primaryKey: true,
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
        },
        key: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        status: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
        permissions: {
            type: DataTypes.ENUM,
            allowNull: false,
            values: ['0000', '1111', '2222']
        }
    }, {
        sequelize,
        modelName: 'ApiKey',
    });
    return ApiKey;
};