var express = require("express");
// const http = require("http");
var path = require("path");
var body_parser = require("body-parser");
const loginRouter = require("./routes/login");
const usersRouter = require("./routes/users");
const vehiclesRouter = require("./routes/vehicles");
const transactionsRouter = require("./routes/transactions");
var app = express();

app.use(body_parser.urlencoded({ extended: false }));
app.use(body_parser.json());

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(express.static(path.join(__dirname, "public")));
app.use("/login", loginRouter);
app.use("/users", usersRouter);
app.use("/vehicles", vehiclesRouter);
app.use("/transactions", transactionsRouter);
app.get("/", (req, res) => {});

app.listen(3000, (err) => {
  if (!err) console.log("Server is running on http://localhost:3000");
});
module.exports = app;

/////////////////////////////////////////////////////////////
//recieve data from arduino

// const SerialPort = require("serialport");
// const Readline = require("@serialport/parser-readline");
// const http = require("http");

// const port = new SerialPort("COM21", { baudRate: 9600 }); // Replace 'COMx' with your Arduino's port
// const parser = port.pipe(new Readline({ delimiter: "\n" }));

// parser.on("data", (data) => {
//   // Send data to index.php using HTTP POST request
//   const postData = JSON.stringify({ sensorData: data });
//   console.log(postData);
//   const options = {
//     hostname: "12.34.56.78",
//     port: 80, // Adjust this port based on your PHP server configuration
//     path: "/index.php",
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       "Content-Length": postData.length,
//     },
//   };

//   const req = http.request(options, (res) => {
//     console.log(`HTTP POST response: ${res.statusCode}`);
//   });

//   req.on("error", (error) => {
//     console.error(`HTTP POST request error: ${error.message}`);
//   });

//   req.write(postData);
//   req.end();
// });
