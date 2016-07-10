var express = require("express");
var server = express();
var search = require("./routes/search.js");
var cart = require("./routes/cart.js");
var checkCookie = require("./routes/checkCookie.js");
var cookieParser = require("cookie-parser")();
var bodyParser = require("body-parser").json();


server.set("port", (process.env.PORT || 8000));
server.use(cookieParser);
server.use(checkCookie);
server.use(bodyParser);
server.use(express.static("./public"));
server.use("/search", search);
server.use("/cart", cart);
server.listen(server.get("port"), () => console.log(`Listening on port: ${server.get("port")}`));
