
var users = require("../data/users.js").data;


var checkCookie = function(req, res, next) {
  if (req.cookies.sessionID) {
    next();
  } else {
    var cookie = Date.now();
    res.cookie("sessionID", cookie, { expires: new Date(Date.now() + 6048000000)});
    createUser(cookie);
    next();
  }
};

var createUser = function(cookie){
  users.push({user: cookie, cart:[]});
};

module.exports = checkCookie;
