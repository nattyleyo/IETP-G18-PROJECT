var express = require("express");
var path = require("path");
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");

var app = express();

app.listen(3000, (err) => {
  if (!err) console.log("Server is running on http://localhost:3000");
});
// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(express.static(path.join(__dirname, "public")));

// app.use("/", indexRouter);
app.get("/", function (req, res, next) {
  res.status(200).render("base", { me: "addddddddnnnnnnn" });
});
// app.use("/users", usersRouter);

// catch 404 and forward to error handler
//
// error handler
// app.use(function (err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get("env") === "development" ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render("error");
// });

module.exports = app;
//recieve data from arduino

// const SerialPort = require("serialport");
// const Readline = require("@serialport/parser-readline");
// const http = require("http");

// const port = new SerialPort("COM22", { baudRate: 9600 }); // Replace 'COMx' with your Arduino's port
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
