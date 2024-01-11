var express = require("express");
var router = express.Router();
var pool = require("../database");
var userInfo = {};
var dataMessage = {};

router.use(
  require("express-session")({
    secret: "my-secret-key",
    resave: false,
    saveUninitialized: false,
  })
);

/* GET home page. */
router.get("/", function (req, res, next) {
  if (!(userInfo.oid && userInfo.password)) {
    // Perform authentication logic here, such as validating credentials against a database
    dataMessage = {
      data: userInfo,
      success: false,
      message: "please fill all information!",
    };
    // Assuming authentication is successful, you can render the page with the data
  } else {
    if (userInfo.oid != "nat" && userInfo.password == 123) {
      dataMessage = {
        data: userInfo,
        success: false,
        message: "username incorrect",
      };
    } else if (userInfo.oid == "nat" && userInfo.password != 123) {
      dataMessage = {
        data: userInfo,
        success: false,
        message: "password incorrect",
      };
    } else if (userInfo.oid != "nat" && userInfo.password != 123) {
      dataMessage = {
        data: userInfo,
        success: false,
        message: "invalid userinfo entered",
      };
    } else {
      res.redirect("/users");
      return;
    }
  }
  res.render("login", { dataMessage });
});

router.post("/", function (req, res, next) {
  // Retrieve the login credentials from the request body
  const loginAs = req.body.loginAs;
  const oid = req.body.oid;
  const password = req.body.password;
  userInfo = { loginAs, oid, password };
  res.redirect("/login");
});

module.exports = router;
