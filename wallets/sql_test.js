const mysql = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'chamchi',
  password : process.env.mysql_chamchi_pw,
  database : 'chamchi_database'
});
connection.connect();
 
connection.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
  if (error) throw error;
  console.log('The solution is: ', results[0].solution);
});

connection.end();