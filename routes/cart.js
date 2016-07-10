var cart = require("express").Router();
var users = require("../data/users.js").data;

cart.get("/", function(req, res) {
  console.log(req.cookies.sessionID);
  console.log(users);
  res.send();
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
  res.send(req.body);
});

module.exports = cart;
