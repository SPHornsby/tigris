var search = require("express").Router();
var items = require("../data/items.js").data;
var _ = require("underscore");
var MongoClient = require("mongodb").MongoClient;
var url = "mongodb://localhost:27017/tigris";

search.get("/item", function(req, res) {
  var itemNumber = parseInt(req.query.q, 10);
  if (itemNumber === itemNumber) {
    var item = idSearch(items, itemNumber);
    res.send(item);
  } else {
    console.log("Not valid");
    res.send();
  }
});


search.get("/item", function(req, res) {
  var itemNumber = parseInt(req.query.q, 10);
  if (itemNumber === itemNumber) {
    var item = idSearch(items, itemNumber);
    res.send(item);
  } else {
    console.log("Not valid");
    res.send();
  }
});


search.put("/item", function(req, res) {

});

search.get("/", function(req, res) {
  var searchTerm = req.query.q.toLowerCase();
  var complete = completeSearch(items, searchTerm);
  var stringResult = JSON.stringify(complete);
  res.send(stringResult);
});

// search.get("/", function(req, res) {
//   var terms = req.query.q.toLowerCase();
//   MongoClient.connect(url, function(err, db) {
//     if (err){
//       res.send(err);
//       db.close();
//     } else {
//       dbSearch(terms, db, function(results) {
//         db.close();
//         res.send(results);
//       });
//     }
//     db.close();
//   });
//  });

//functions

// var dbSearch = function(terms, db, callback) {
//   var collection = db.collection("tigris");
//   collection.find({keywords: terms}).toArray(function(err, docs) {
//     callback(docs);
//   });
// };

var completeSearch = function(list, searchTerm) {
  var fields = ["name", "creator"];
  var result = _.chain(fields).map(function(field) {
    return initialSearch(list, searchTerm, field);
  })
  .flatten()
  .value();
  if (result.length > 0) {
    return result;
  } else {
    var properties = ["name", "creator", "keywords"];
    return _.chain(properties).map(function(property) {
      return searchByProperty(list, property, searchTerm);
    })
    .flatten()
    .uniq()
    .value();
  }
};

var idSearch = function(list, itemNumber) {
  return _.find(list, item => item.id === itemNumber);
};

var initialSearch = function(list, searchTerm, property) {
  return _.filter(list, function(item) {
    return item[property] === parseInt(searchTerm, 10);
  });
};

var searchByProperty = function(list, property, term) {
  var terms = term.split(" ");
  return _.map(terms, function(term) {
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
