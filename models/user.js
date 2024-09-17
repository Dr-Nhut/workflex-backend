'use strict';
const {
  Model
} = require('sequelize');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      this.belongsTo(models.Role, {
        foreignKey: 'roleId',
      });
      this.belongsToMany(models.Category, { through: 'UserCategories' });
      this.belongsToMany(models.Skill, { through: 'UserSkills' });

      this.hasMany(models.Job, {
        foreignKey: 'creatorId',
        constraints: false,
      });

      this.hasMany(models.Offer, {
        foreignKey: 'creatorId',
        constraints: false,
      });

      this.hasMany(models.Contract, {
        foreignKey: 'employerId',
        constraints: false,
      });

      this.hasMany(models.Contract, {
        foreignKey: 'freelancerId',
        constraints: false,
      });

      this.hasMany(models.Contract, {
        foreignKey: 'lastUserModified',
        constraints: false,
      });

      this.hasMany(models.Task, {
        foreignKey: 'creatorId',
        constraints: false,
      });

      this.hasMany(models.Feedback, {
        foreignKey: 'senderId',
        constraints: false,
      });

      this.hasMany(models.Feedback, {
        foreignKey: 'receiverId',
        constraints: false,
      });
    }

    static async comparePassword(password, hashedPassword) {
      return bcrypt.compare(password, hashedPassword)
    }

    changedPasswordAfter(jwtIat) {
      if (this.passwordChangedAt) {
        const passwordTime = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
        return passwordTime > jwtIat
      }
      return false;
    }

    createPasswordResetToken() {
      const resetToken = crypto.randomBytes(32).toString('hex');

      this.passwordResetToken = crypto.createHash("sha256").update(resetToken).digest('hex');
      this.passwordResetExpires = Date.now() + 5 * 60 * 1000;

      return resetToken;
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
        },
        notEmpty: {
          msg: "Bạn chưa điền mật khẩu!!!"
        }
      }
    },
    passwordResetToken: DataTypes.STRING,
    passwordResetExpires: DataTypes.DATE,
    passwordChangedAt: {
      type: DataTypes.DATE,
    },
    address: DataTypes.STRING,
    bio: DataTypes.STRING,
    sex: DataTypes.BOOLEAN,
    bankAccount: DataTypes.STRING,
    dayOfBirth: DataTypes.DATE,
    experience: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'User',
    defaultScope: {
      attributes: { exclude: ['password'] },
    },
    scopes: {
      withPassword: {
        attributes: {},
      },
    },
  });

  User.beforeCreate(async (user, options) => {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    user.password = hashedPassword;
  });

  User.beforeSave(async (user, options) => {
    if (user._changed.has('passwordResetToken') && !user.isNewRecord) {
      user.passwordChangedAt = Date.now() - 1000;
    }
  })

  return User;
};