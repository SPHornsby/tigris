var user = require("express").Router();
var users = require("../data/users.js").data;

user.get("/", function(req, res) {
  console.log("GET USER");
  var id = req.cookies.sessionID;
  var thisUser = users.filter(function(user) {
    return user.user == id;
  });
  res.send();
});
user.put("/", function(req, res) {
  var id = req.cookies.sessionID;
  var thisUser = users.filter(function(user) {
    return user.user == id;
  })[0];
  thisUser.orders.push((req.body));
  thisUser.cart = [];
  res.send(thisUser.orders);
})
module.exports = user;
