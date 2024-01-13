const mysql = require("mysql");

const pool = mysql.createPool({
  connectionLimit: 10,
  host: "localhost",
  user: "natty",
  password: "12345678",
  database: "g18_database",
});
module.exports = pool;
