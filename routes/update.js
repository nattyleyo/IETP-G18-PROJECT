var express = require("express");
var router = express.Router();
const multer = require("multer");
const path = require("path");
var pool = require("../database");

/* GET home page. */

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

router.post("/", upload.single("photo"), (req, res) => {
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
  const photo = req.file
    ? req.file.path.replace(/\\/g, "/").replace("public/", "")
    : null; // Check if an image was uploaded
  console.log("is photo ");
  console.log(req.file);
  pool.getConnection((err, conn) => {
    if (err) throw err;
    console.log(`database@ connected at id ${conn.threadId}`);
    // Insert user data into the database
    conn.query(
      `UPDATE users SET UserID=?, UserName=?, UserAddress=?, Phone=?, AccountBalance=?, photo = IF(photo IS NULL,?, photo) WHERE UserID=${UserID}`,
      [UserID, UserName, UserAddress, Phone, AccountBalance, photo],
      (error, userResults) => {
        if (!error) {
          console.log("User Data Updated successfully:", userResults.insertId);
          conn.query(
            `UPDATE vehicles SET  vehicleId=?, UserID=?, licensePlate=?, vehicleType=? WHERE vehicleId='${vehicleId}'`,
            [vehicleId, UserID, licensePlate, vehicleType], // Replace with actual values
            (vehicleError, vehicleResults) => {
              if (vehicleError) {
                console.error("Error Data failed to update:", vehicleError);
                return res.status(500).send("Vehicle Data failed to update.");
              }
              console.log(
                "Vehicle Data failed updated successfully:",
                vehicleResults.insertId
              );
              let successMessage = "User Data updated successfully!";
              res.redirect(
                `/users?id=${UserID}&success=${encodeURIComponent(
                  successMessage
                )}`
              );
            }
          );
        } else {
          console.error("User Data failed to update:", error);
        }
        // Now, insert vehicle data into the 'vehicles' table
        // const vehicleId = userResults.insertId; // Use the user's insertId as the vehicleId
      }
    );
  });
});

module.exports = router;
