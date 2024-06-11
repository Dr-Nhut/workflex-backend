'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class UserSkills extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    UserSkills.init({
        UserId: DataTypes.UUID,
        SkillId: DataTypes.UUID
    }, {
        sequelize,
        modelName: 'UserSkills',
    });
    return UserSkills;
};