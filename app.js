const mysql = require('mysql');
const fs = require('fs');

var connection = mysql.createConnection({
    host     : 'localhost',
    port: 3306,
    user     : 'root',
    password : 'password',
    database : 'employee_tracker'
});

connection.connect(function(err){
    if (err) throw err;
    connection.end();
});

