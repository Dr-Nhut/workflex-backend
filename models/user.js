'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.belongsToMany(models.Category, { through: 'UserCategories' });
    }
  }
  User.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Bạn chưa nhập tên!!!'
        }
      }
    },
    avatar: DataTypes.STRING,
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      set(value) {
        if (value !== null && value !== undefined) {
          this.setDataValue('email', value.toLowerCase());
        }
      },
      unique: {
        msg: 'Địa chỉ email đã tồn tại!!!'
      },
      validate: {
        isEmail: {
          msg: 'Địa chỉ email không hợp lệ!!!'
        },
        notNull: {
          msg: 'Bạn chưa nhập địa chỉ email!!!'
        }
      }
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: {
        msg: 'Số điện thoại đã tồn tại!!!'
      },
      validate: {
        is: {
          args: /^(0|\+84)(3|5|7|8|9)[0-9]{8}$/,
          msg: 'Số điện thoại không hợp lệ!!!'
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Bạn chưa điền mật khẩu!!!"
        }
      }
    },
    address: DataTypes.STRING,
    bio: DataTypes.STRING,
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Bạn chưa chọn loại tài khoản!!!"
        },
        isIn: {
          args: [['adm', 'emp', 'fre']],
          msg: "Loại tài khoản không hợp lệ"
        },
      }
    },
    sex: DataTypes.BOOLEAN,
    bankAccount: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};