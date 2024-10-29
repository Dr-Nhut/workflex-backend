require('dotenv').config();  // Đảm bảo bạn load biến môi trường trước khi khởi tạo Sequelize

module.exports = {
  development: {
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    host: 'localhost',
    port: 5432,
    dialect: 'postgres'
  }
};
