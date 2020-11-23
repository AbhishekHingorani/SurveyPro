const mysql = require("mysql");
const { sqlUser, sqlPassword, sqlDbName } = require("../config/config");

// getting the database credentials from env file and estabilishing connection
const connection = mysql.createConnection({
  host: "localhost",
  user: sqlUser,
  password: sqlPassword,
  database: sqlDbName,
});

module.exports = connection;
