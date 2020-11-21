var mysql = require('mysql');

var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'nodeuser',
    password : 'password',
    database : 'surveypro'
});

module.exports = connection;