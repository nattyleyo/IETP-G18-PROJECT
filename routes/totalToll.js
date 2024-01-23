var express = require("express");
var router = express.Router();
var pool = require("../database");

// GET total sum of timestamps for today's transactions
router.get("/", (req, res) => {
  // Get the current date
  var currentDate = new Date().toISOString().split("T")[0];

  // Execute the SQL query to get the total sum of timestamps for today's transactions
  pool.query(
    "SELECT SUM(Amount) AS totalSum FROM transactions WHERE DATE(Timestamp) = ?",
    [currentDate],
    (error, results) => {
      if (error) {
        console.error("Error getting total sum:", error);
        res.status(500).send("Failed to get total sum.");
      } else {
        var totalSum = results[0].totalSum;
        res.status(200).json({ totalSum: totalSum });
      }
    }
  );
});

module.exports = router;
