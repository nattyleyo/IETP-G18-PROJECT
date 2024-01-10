const mysql = require("mysql");

const pool = mysql.createPool({
  connectionLimit: 10,
  host: "localhost",
  user: "natty",
  password: "1234abcd@",
  database: "cartoll_db",
});
module.exports = pool;
