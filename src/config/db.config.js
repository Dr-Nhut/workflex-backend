const mysql = require('mysql2');
require('dotenv/config')

const conn = mysql.createConnection({
    host: "localhost",
    user: process.env.USER_DB,
    password: process.env.PASSWORD_DB,
    database: process.env.NAME_DB,
});


module.exports = conn;
