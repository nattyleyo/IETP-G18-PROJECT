var express = require("express");
var router = express.Router();
var pool = require("../database");

module.exports = (wss) => {
  /* GET home page. */
  router.get("/", function (req, res, next) {
    const userId = req.query.id;
    pool.getConnection((err, conn) => {
      if (err) throw err;
      console.log(`database connected at id ${conn.threadId}`);

      // for fetching the table
      var queryStr = `SELECT * from users`;
      conn.query(queryStr, (err, rows) => {
        conn.release();
        if (!err) {
          // for one userId
          var userData = {};
          for (i = 0; i < rows.length; i++) {
            if (userId == rows[i].UserID) {
              userData = rows[i];
            }
          }

          var flag = { userDisp: "", vehcDisp: "hidden", transDisp: "hidden" };
          var dataSet = [rows, flag, userData];

          // Send updates to connected WebSocket clients
          const updateMessage = JSON.stringify({ dataSet });
          wss.clients.forEach((client) => {
            try {
              // Avoid blocking operations when sending updates to clients
              client.send(updateMessage);
            } catch (e) {
              console.error("Error sending WebSocket update:", e.message);
            }
          });

          // Render the template and send the response
          res.render("base", {
            dataSet,
          });
        } else {
          console.log(err);
        }
      });
    });
  });

  return router;
};
