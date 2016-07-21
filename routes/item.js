var item = require("express").Router();
var items = require("../data/items.js").data;

item.put("/", function(req, res) {
  var id = JSON.parse(req.body.item);
  var review = req.body.review;
  var dataItem = items.filter(function(item) {
    console.log(id, item.id);
    return item.id === id;
  });
  console.log(dataItem);
  dataItem[0].reviews.push(review);
  res.send(dataItem[0]);
});

module.exports = item;
