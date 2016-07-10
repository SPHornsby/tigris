var search = require("express").Router();
var items = require("../data/items.js").data;
var _ = require("underscore");
search.get("/", function(req, res) {
  var query = req.query;
  var searchTerm = req.query.q.toLowerCase();
  var complete = completeSearch(items, searchTerm);
  var stringResult = JSON.stringify(complete);
  res.send(stringResult);
});
var completeSearch = function(list, searchTerm) {
  var fields = ["name", "creator"];
  var result = _.chain(fields).map(function(field) {
    return initialSearch(list, searchTerm, field);
  }).flatten().value();
  if (result.length > 0) {
    return result;
  } else {
    var properties = ["name", "creator", "keywords"];
    return _.chain(properties).map(function(property) {
      return searchByProperty(list, property, searchTerm);
    }).flatten().uniq().value();
  }
};
var initialSearch = function(list, searchTerm, property) {
  return _.filter(list, function(item) {
    return item[property] === searchTerm;
  });
};
var searchByProperty = function(list, property, term) {
  console.log(`term ${term}`);
  var terms = term.split(" ");
  return _.map(terms, function(term) {
    console.log(term);
    return _.filter(list, function(item) {
      var searchProperty = item[property];
      if (typeof searchProperty === "string") {
        searchProperty = searchProperty.toLowerCase();
      }
      return searchProperty.indexOf(term) !== -1;
    });
  });
};

module.exports = search;
