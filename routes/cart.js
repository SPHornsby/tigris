var cart = require("express").Router();
var users = require("../data/users.js").data;

cart.get("/", function(req, res) {
  var sessionID = req.cookies.sessionID;
  var user = users.filter(function(user) {
    return user.user == sessionID;
  });
  res.send(JSON.stringify(user[0].cart));
});

cart.post("/", function(req, res) {
  var sessionID = req.cookies.sessionID;
  var user = users.filter(function(user) {
    return user.user == sessionID;
  });
  if (req.body.dataID) {
    var item = JSON.parse(req.body.dataID);
    user[0].cart.push(item);
  }
  res.send();
});

cart.delete("/", function(req, res) {
  var item = JSON.parse(req.body.dataID);
  var sessionID = req.cookies.sessionID;
  var user = users.filter(function(user) {
    return user.user == sessionID;
  });
  var cart = user[0].cart;
  var index = cart.indexOf(item);
  cart.splice(index, 1);
  res.send();
});

module.exports = cart;
