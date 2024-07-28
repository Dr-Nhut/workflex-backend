'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class KeyToken extends Model {
    static associate(models) {
      // define association here
      this.belongsTo(models.User, { foreignKey: 'userId' });
    }
  }
  KeyToken.init({
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    publicKey: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    privateKey: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    refreshTokenUsed: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: []
    },
    refreshToken: {
      type: DataTypes.STRING,
    }
  }, {
    sequelize,
    modelName: 'KeyToken',
  });
  return KeyToken;
};