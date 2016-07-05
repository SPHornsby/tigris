var search = require("express").Router();
var items = require("../data/items.js").data;
search.get("/", function(req, res) {
  var query = req.query;
  var searchTerm = req.query.q;
  var result = getItem(items, searchTerm);
  var stringResult = JSON.stringify(result);
  res.send(stringResult);
});


var getItem = function(list, searchTerm) {
  return list.filter(item => item.name === searchTerm);
};

module.exports = search;
