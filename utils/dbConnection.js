const mysql = require('mysql2');
const config = require('../config');

const dbConnection = mysql.createPool({
    host: config.config.db.host,
    user: config.config.db.user,
    password: config.config.db.pass,
    database: config.config.db.database
});

module.exports = dbConnection.promise();