var express = require("express");
var server = express();
var search = require("./routes/search.js");

server.set("port", (process.env.PORT || 8000));

server.use(express.static("./public"));
server.use("/search", search);
server.listen(server.get("port"), () => console.log(`Listening on port: ${server.get("port")}`));
