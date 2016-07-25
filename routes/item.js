var item = require("express").Router();
var items = require("../data/items.js").data;

item.put("/", function(req, res) {
  var id = JSON.parse(req.body.item);
  var review = req.body.review;
  var dataItem = items.filter(function(item) {
    return item.id === id;
  });
  dataItem[0].reviews.push(review);
  res.send();
});

module.exports = item;
