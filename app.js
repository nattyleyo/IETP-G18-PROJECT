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
function generateUserObject(uid, balance) {
  return {
    UID: uid,
    Balance: balance,
  };
}
function me(uid, balance) {
  // Example: Generate a dynamic user object
  let dynamicUser = generateUserObject(uid, balance);
  // window.location.reload();

  // Make the fetch request with the dynamic user object
  fetch("script.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(dynamicUser),
  })
    .then(function (res) {
      return res.text();
    })
    .then(function (data) {
      console.log(data);
      document.querySelector(".sample").innerHTML = data;
    });
}
// Update every 5 seconds (5000 milliseconds)
setInterval(function () {
  me("UIDDDD", "helowwwww");
}, 5000);
