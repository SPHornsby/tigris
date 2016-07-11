
var users = require("../data/users.js").data;


var checkCookie = function(req, res, next) {
  console.log("checkCookie");
  var cookie = req.cookies.sessionID;
  if (cookie) {
    console.log("cookie found, checking for user");
    console.log(`cookie: ${cookie}`);
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
  console.log(users);
};
var checkForUser = function(id) {
  console.log(id);
  console.log("user check");
  var user = users.filter(function(user) {
    return user.user == id;
  });
  if (user.length === 0) {
    console.log("User not found, creating");
    createUser(id);
  };
};
module.exports = checkCookie;
