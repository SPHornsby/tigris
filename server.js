var express = require("express");
var server = express();

server.set("port", (process.env.PORT || 8000))

server.use(express.static("./public"));

server.listen(server.get("port"), () => console.log(`Listening on port: ${server.get("port")}`));
