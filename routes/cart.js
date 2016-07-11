var cart = require("express").Router();
var users = require("../data/users.js").data;

cart.get("/", function(req, res) {
  var sessionID = req.cookies.sessionID;
  var user = users.filter(function(user) {
    return user.user == sessionID;
  });
  res.send(user.cart);
});
cart.post("/", function(req, res) {
  var item,
    cart;
  var sessionID = req.cookies.sessionID;
  var user = users.filter(function(user) {
    return user.user == sessionID;
  });
  if (req.body.dataID) {
    item = JSON.parse(req.body.dataID);
    user[0].cart.push(item);
  }
  cart = user[0].cart;
  res.send(cart);
});

module.exports = cart;
