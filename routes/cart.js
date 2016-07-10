var cart = require("express").Router();
var users = require("../data/users.js").data;

cart.get("/", function(req, res) {
  console.log(req.cookies.sessionID);
  console.log(users);
  res.send();
});
cart.post("/", function(req, res) {
  var sessionID = req.cookies.sessionID;

});

module.exports = cart;
