var express = require("express");
var router = express.Router();
var pool = require("../database");

/* GET home page. */
router.get("/", function (req, res, next) {
  const userId = req.query.id;

  pool.getConnection((err, conn) => {
    if (err) throw err;
    console.log(`database connected at id ${conn.threadId}`);
    var queryStr = `SELECT * from vehicles`;
    conn.query(queryStr, (err, rows) => {
      conn.release();
      if (!err) {
        // rows.push();
        var userData = {};
        for (i = 0; i < rows.length; i++) {
          if (userId == rows[i].UserID) {
            userData = rows[i];
          }
        }
        flag = { userDisp: "hidden", vehcDisp: "", transDisp: "hidden" };
        var dataSet = [rows, flag, userData];
        res.render("base", {
          dataSet,
        });
        console.log(dataSet); // Log the received data to the console
      } else {
        console.log(err);
      }
    });
  });
});
module.exports = router;
