'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.changeColumn('Users', 'name', {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Bạn chưa nhập tên!!!'
        }
      }
    })

    await queryInterface.changeColumn('Users', 'email', {
      type: Sequelize.STRING,
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
    })

    await queryInterface.changeColumn('Users', 'phone', {
      type: Sequelize.STRING,
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
    })

    await queryInterface.changeColumn('Users', 'password', {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Bạn chưa điền mật khẩu!!!"
        }
      }
    })

    await queryInterface.changeColumn('Users', 'role', {
      type: Sequelize.STRING,
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
    })
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.changeColumn('Users', 'name', {
      type: Sequelize.STRING,
    });

    await queryInterface.changeColumn('Users', 'email', {
      type: Sequelize.STRING,
    });

    await queryInterface.changeColumn('Users', 'phone', {
      type: Sequelize.STRING,
    });

    await queryInterface.changeColumn('Users', 'password', {
      type: Sequelize.STRING,
    });

    await queryInterface.changeColumn('Users', 'role', {
      type: Sequelize.STRING,
    });
  }
};
