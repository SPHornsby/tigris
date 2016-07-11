var cart = require("express").Router();
var users = require("../data/users.js").data;

cart.get("/", function(req, res) {
  console.log(req.cookies.sessionID);
  var user = users.filter(function(user) {
    return user.user == sessionID;
  });

  res.send(user.cart);
});
cart.post("/", function(req, res) {
  var item = JSON.parse(req.body.dataID);
  //console.log(req);
  var sessionID = req.cookies.sessionID;
  var user = users.filter(function(user) {
    return user.user == sessionID;
  });
  user[0].cart.push(item);
  console.log(user[0].cart);
  var cart = user[0].cart;
  console.log(`cart ${cart}`);
  res.send(cart);
});

module.exports = cart;
