var express = require("express");
var router = express.Router();
var database = require("../database");
/* GET home page. */
router.get("/", function (req, res, next) {
  res.statusCode(200).render("base", { me: "nnnnnnn" });
});

module.exports = router;
