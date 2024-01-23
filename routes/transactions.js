var express = require("express");
var router = express.Router();
var pool = require("../database");

/* GET home page. */
router.get("/", function (req, res, next) {
  const userId = req.query.id;

  pool.getConnection((err, conn) => {
    if (err) throw err;
    console.log(`database connected at id ${conn.threadId}`);
    var queryStr = `SELECT * from transactions`;
    conn.query(queryStr, (err, rows) => {
      // conn.release();
      if (!err) {
        // var todayToll = 0;
        // Get the current date
        var currentDate = new Date().toISOString().split("T")[0];
        // Execute the SQL query to get the total sum of timestamps for today's transactions
        conn.query(
          "SELECT SUM(Amount) AS totalSum FROM transactions WHERE DATE(Timestamp) = ?",
          [currentDate],
          (error, results) => {
            conn.release();
            if (error) {
              console.error("Error getting total sum:", error);
              res.status(500).send("Failed to get total sum.");
            } else {
              var todayToll = results[0].totalSum;
              console.log("toll", results[0].totalSum);
              var userData = {};
              for (i = 0; i < rows.length; i++) {
                if (userId == rows[i].UserID) {
                  userData = rows[i];
                }
              }
              flag = { userDisp: "hidden", vehcDisp: "hidden", transDisp: "" };
              var dataSet = [rows, flag, userData, todayToll];
              res.render("base", {
                dataSet,
              });
              console.log(dataSet);
              // res.status(200).json({ totalSum: totalSum });
            }
          }
        );
      } else {
        console.log(err);
      }
    });
  });
});

module.exports = router;
