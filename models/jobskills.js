'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class JobSkills extends Model {
        static associate(models) {
        }
    }
    JobSkills.init({
        JobId: DataTypes.UUID,
        SkillId: DataTypes.UUID
    }, {
        sequelize,
        modelName: 'JobSkills',
    });
    return JobSkills;
};