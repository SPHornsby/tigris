
var users = require("../data/users.js").data;


var checkCookie = function(req, res, next) {
  if (req.cookies.sessionID) {
    checkForUser(cookie);
    next();
  } else {
    var cookie = Date.now();
    res.cookie("sessionID", cookie, { expires: new Date(Date.now() + 6048000000)});
    createUser(cookie);
    next();
  }
};

var createUser = function(id){
  users.push({user: id, cart:[]});
};
var checkForUser = function(id) {
  var user = users.filter(function(user) {
    return user.user == id;
  });
  if (user.length === 0) {
    console.log("User not found, creating");
    createUser(id);
  };
};
module.exports = checkCookie;
