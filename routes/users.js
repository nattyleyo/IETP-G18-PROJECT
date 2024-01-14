var express = require("express");
var router = express.Router();
const multer = require("multer");
const path = require("path");
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

  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "public/uploads/");
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      const formattedPath =
        file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname);
      cb(null, formattedPath);
    },
  });

  const upload = multer({ storage: storage });

  // Handle POST requests
  router.use(express.urlencoded({ extended: true }));

  router.post("/", upload.single("image"), (req, res) => {
    const {
      UserID,
      UserName,
      UserAddress,
      Phone,
      AccountBalance,
      vehicleId,
      licensePlate,
      vehicleType,
    } = req.body;
    console.log(req.body);
    const photo = req.file
      ? req.file.path.replace(/\\/g, "/").replace("public/", "")
      : null; // Check if an image was uploaded
    pool.getConnection((err, conn) => {
      if (err) throw err;
      console.log(`database connected at id ${conn.threadId}`);
      // Insert user data into the database
      conn.query(
        `INSERT INTO users (UserID, UserName, UserAddress, Phone, AccountBalance, photo) VALUES (?, ?, ?, ?, ?, ?)`,
        [UserID, UserName, UserAddress, Phone, AccountBalance, photo],
        (error, userResults) => {
          if (error) {
            console.error("Error registering user:", error);
            return res.status(500).send("User registration failed.");
          }
          console.log("User registered successfully:", userResults.insertId);
          // Now, insert vehicle data into the 'vehicles' table
          const vehicleId = userResults.insertId; // Use the user's insertId as the vehicleId
          conn.query(
            `INSERT INTO vehicles (vehicleId, UserID, licensePlate, vehicleType) VALUES (?, ?, ?, ?)`,
            [vehicleId, UserID, "LicensePlateValue", "VehicleTypeValue"], // Replace with actual values
            (vehicleError, vehicleResults) => {
              if (vehicleError) {
                console.error("Error registering vehicle:", vehicleError);
                return res.status(500).send("Vehicle registration failed.");
              }

              console.log(
                "Vehicle registered successfully:",
                vehicleResults.insertId
              );
              let suc = "Registration successful!";
              res.render("base", { suc });
            }
          );
        }
      );
    });
  });

  return router;
};
