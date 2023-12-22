// db.js

const mysql = require('mysql'); 

const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'HIS',
  connectionLimit: 100,
});

module.exports = {db};
