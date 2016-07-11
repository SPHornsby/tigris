var express = require("express");
var app = express();
var search = require("./routes/search.js");
var cart = require("./routes/cart.js");
var checkCookie = require("./routes/check-cookie.js");
var cookieParser = require("cookie-parser")();
var bodyParser = require("body-parser").json();


app.set("port", (process.env.PORT || 8000));
app.use(cookieParser);
app.use(checkCookie);
app.use(bodyParser);
app.use(express.static("./public"));
app.use("/search", search);
app.use("/cart", cart);
app.listen(app.get("port"), () => console.log(`Listening on port: ${app.get("port")}`));
