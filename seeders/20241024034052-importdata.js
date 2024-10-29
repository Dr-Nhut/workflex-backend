'use strict';

/** @type {import('sequelize-cli').Migration} */
const model = require('../models');
const fs = require('fs').promises;

const pluralToSingular = (plural) => {
  if (plural.endsWith('ies')) {
    return plural.slice(0, -3) + 'y'; // ví dụ: 'categories' -> 'category'
  } else if (plural.endsWith('s')) {
    return plural.slice(0, -1); // ví dụ: 'users' -> 'user'
  }
  return plural; // trả về nguyên mẫu nếu không trùng khớp
};


module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      const files = await fs.readdir('data');
      const jsonData = await Promise.all(
        files.map(async file => {
          return await fs.readFile(`data/${file}`, 'utf8');
        })
      );

      const data = jsonData.map(dataFile => JSON.parse(dataFile));
      for (let index in data) {
        await model[pluralToSingular(files[index].split('.')[0])]?.bulkCreate(data[index]);
      }
    } catch (err) {
      throw err;
    }
  },

  async down(queryInterface, Sequelize) {
    try {
      const files = await fs.readdir('data');
      // files.forEach(file => {
      //   model[file]?.destroy({
      //     truncate: true,
      //   });
      // })
      for (let file of files) {
        await model[pluralToSingular(file.split('.')[0])]?.destroy({
          truncate: true,
          cascade: true,
        });
      }
    } catch (error) {
      throw error;
    }
  }
};
