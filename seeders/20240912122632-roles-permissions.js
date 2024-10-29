const model = require('../models');
const Constants = require('../constants');

const { Role, Permission } = model;

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await Role.bulkCreate([
      { title: Constants.ROLE_ADMIN },
      { title: Constants.ROLE_EMPLOYER },
      { title: Constants.ROLE_FREELANCER },
    ])

    await Permission.bulkCreate([
      { title: Constants.PERMISSION_ADD_CATEGORY },
      { title: Constants.PERMISSION_ADD_SKILL },
    ]);
  },

  // eslint-disable-next-line no-unused-vars
  down: async (queryInterface, Sequelize) => {
    await Role.destroy();
    await Permission.destroy();
  },
};
