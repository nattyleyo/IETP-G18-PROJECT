const express = require("express");
const http = require("http");
const path = require("path");
var pool = require("./database");
const twilio = require("twilio");
// Twilio credentials
const accountSid = "";
const authToken = "";
const twilioPhoneNumber = "";

const client = twilio(accountSid, authToken);

//routes
var body_parser = require("body-parser");
const loginRouter = require("./routes/login");
const usersRouter = require("./routes/users");
const vehiclesRouter = require("./routes/vehicles");
const transactionsRouter = require("./routes/transactions");
//serial and database
const SerialPort = require("serialport");
const Readline = require("@serialport/parser-readline");
const WebSocket = require("ws");
const mysql = require("mysql");

//setingup server
const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

//setup template engine

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

//encoding
app.use(body_parser.urlencoded({ extended: false }));
app.use(body_parser.json());
//use routes
app.use(express.static(path.join(__dirname, "public")));
// app.use("/login", loginRouter);
app.use("/users", usersRouter(wss));
app.use("/vehicles", vehiclesRouter);
app.use("/transactions", transactionsRouter);
// Adjust the port name based on your Arduino
const portName = "COM26";
const port = new SerialPort(portName, { baudRate: 9600 });
const parser = port.pipe(new Readline({ delimiter: "\n" }));

// app.get("/", (req, res) => {
//   var dataSet = [
//     {},
//     { userDisp: "", vehcDisp: "hidden", transDisp: "hidden" },
//     {},
//   ];

//   res.render("base", { dataSet });
// });
var rowData = {};
wss.on("connection", (ws) => {
  console.log("WebSocket connection established");

  parser.on("data", async (data) => {
    try {
      // Insert data into MySQL database
      // pool.query("INSERT INTO your_table_name (column_name) VALUES (?)", [data]);
      // Query the database to get the inserted row
      data = parseInt(data.replace(/\s/g, ""), 10);
      console.log(data);
      pool.getConnection((err, conn) => {
        if (err) throw err;
        console.log(`database connected at id ${conn.threadId}`);
        var sentData = {};
        conn.query(
          `SELECT users.*, vehicles.* FROM users LEFT JOIN vehicles ON users.UserID = vehicles.UserID WHERE users.UserID = ?`,
          [data],
          (error, results) => {
            conn.release();

            if (error) {
              console.error("Error querying the database:", error.message);
              return;
            }

            const rows = results;

            if (rows.length > 0) {
              rowData = rows[0];
              console.log("ALL data:", rowData.UserID);
              // rowData.AccountBalance = rowData.AccountBalance - 25;
              // Send the row data to connected WebSocket clients
              ws.send(JSON.stringify(rowData));
              console.log(rowData.AccountBalance);

              sentData = rowData;

              // Insert data into transactions table
              let tempStatus = "";
              var amount = 0;
              console.log("data wanrweeeeeeeeeeeee");
              console.log(rowData.AccountBalance);

              if (
                sentData.AccountBalance != null &&
                sentData.AccountBalance - 25 > 25
              ) {
                tempStatus = "Access granted";
                amount = 25;
                // ////////block to send sms
                var to = "+251987158100"; // Replace with the recipient's phone number
                var body = `Dear ${sentData.UserName} your UserID ${
                  sentData.UserID
                } has been debited with ETB ${amount} for toll price. Your Current Balance is ETB ${
                  sentData.AccountBalance - amount
                }.Thank you for using FastExpress. Have safe journy!`;
                var from = twilioPhoneNumber;
                sendSMS(body, from, to);
                // //end here...
              } else {
                tempStatus = "Access denied";
                amount = 0;
              }
              const transactionData = {
                UserID: sentData.UserID,
                VehicleID: sentData.VehicleID,
                Amount: amount,
                Status: tempStatus,
              };

              console.log(transactionData);

              try {
                conn.query("INSERT INTO transactions SET ?", transactionData);
                console.log("Data inserted into transactions table");

                // Update AccountBalance
                const newAccountBalance =
                  sentData.AccountBalance > 25
                    ? sentData.AccountBalance - 25
                    : sentData.AccountBalance;
                const updateQuery =
                  "UPDATE Users SET AccountBalance = ? WHERE UserID = ?";
                const updateValues = [newAccountBalance, sentData.UserID];

                conn.query(
                  updateQuery,
                  updateValues,
                  (updateError, updateResults) => {
                    if (updateError) {
                      console.error(
                        "Error updating data:",
                        updateError.message
                      );
                    } else {
                      console.log(
                        "Data updated successfully:",
                        newAccountBalance
                      );
                    }
                  }
                );
              } catch (insertError) {
                console.error(
                  "Error inserting data into transactions table:",
                  insertError.message
                );
              }
            } else {
              ws.send(JSON.stringify("Access Denied"));
              console.log(JSON.stringify("Access Denied"));
              console.log("Data not found in the database");
            }
          }
        );
      });
    } catch (error) {
      console.error("Error interacting with the database:", error.message);
    }
  });
});
port.on("open", () => {
  console.log("Serial port is open");
  // Send two variables to Arduino
});
// Handle errors
port.on("error", (err) => {
  console.error("Error:", err.message);
});
// Function to send an SMS
async function sendSMS(body, from, to) {
  try {
    const message = await client.messages.create({
      body: body,
      from: from,
      to: to,
    });

    console.log("Message sent:", message.sid);
  } catch (error) {
    console.error("Error sending SMS:", error);
  }
}

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}/login`);
});
