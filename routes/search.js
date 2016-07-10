var search = require("express").Router();
var items = require("../data/items.js").data;
var _ = require("underscore");
search.get("/", function(req, res) {
  var query = req.query;
  var searchTerm = req.query.q;
  var result = getItem(items, searchTerm);
  var stringResult = JSON.stringify(result);
  res.send(stringResult);
});


var getItem = function(list, searchTerm) {
  var terms = searchTerm.split(" ");
  var results = [];
  terms.forEach(function(term) {
    results.push(list.filter(item => item.keywords.indexOf(term) != -1));
  })
  // if (terms.length > 1) {
  //   console.log("here");
  // } else {
  //   return list.filter(item => item.keywords.indexOf(searchTerm) != -1);
  // }
  var flat = _.flatten(results);
  var unique = _.uniq(flat);
  console.log(unique);
  return unique;
  //return list.filter(item => item.keywords.indexOf(results[0]) != -1);
};

module.exports = search;
