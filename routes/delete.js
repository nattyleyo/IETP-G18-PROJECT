var express = require("express");
var router = express.Router();
const path = require("path");
var pool = require("../database");

/* GET home page. */

// Handle POST requests
router.use(express.urlencoded({ extended: true }));
router.use(express.json());

router.post("/", (req, res) => {
  var userId = req.body.userId;
  console.log("userId:", userId);
  // Perform further operations with the userId
  // Execute DELETE query
  pool.getConnection((err, conn) => {
    if (err) throw err;
    console.log(`database@ connected at id ${conn.threadId}`);
    // Insert user data into the database
    conn.query(
      "DELETE FROM vehicles WHERE UserID = ?",
      [userId],
      (error, results) => {
        if (!error) {
          console.log(`vehicles with ID ${userId} deleted successfully.`);
          // res.status(200).send("vehicles deleted successfully.");
          conn.query(
            "DELETE FROM users WHERE UserID = ?",
            [userId],
            (error, results) => {
              if (error) {
                console.error("Error deleting user:", error);
                res.status(500).send("Failed to delete user.");
              } else {
                console.log(`User with ID ${userId} deleted successfully.`);
                //   res.status(200).send("User deleted successfully.");
                let successMessage = `User with ID ${userId} deleted successfully.`;
                res.redirect(`/vehicles`);
              }
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
  //   pool.query(
  //     "DELETE FROM vehicles WHERE UserID = ?",
  //     [userId],
  //     (error, results) => {
  //       if (error) {
  //         console.error("Error deleting vehicles:", error);
  //         res.status(500).send("Failed to delete vehicles.");
  //       } else {
  //         console.log(`vehicles with ID ${userId} deleted successfully.`);
  //         // res.status(200).send("vehicles deleted successfully.");
  //         pool.query(
  //           "DELETE FROM users WHERE UserID = ?",
  //           [userId],
  //           (error, results) => {
  //             if (error) {
  //               console.error("Error deleting user:", error);
  //               res.status(500).send("Failed to delete user.");
  //             } else {
  //               console.log(`User with ID ${userId} deleted successfully.`);
  //               //   res.status(200).send("User deleted successfully.");
  //               let successMessage = `User with ID ${userId} deleted successfully.`;
  //               res.redirect(`/vehicles`);
  //             }
  //           }
  //         );
  //       }
  //     }
  //   );
});

module.exports = router;
