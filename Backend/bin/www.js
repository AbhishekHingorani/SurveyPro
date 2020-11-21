const app = require("../server");
const http = require("http");
let { port } = require('../config/config');

port = normalizePort(port);
console.log(port);
app.set('port', port || 3000);

const server = http.createServer(app);

server.listen(port);
server.on("error", onError);
server.on("listening", onListening);

function normalizePort (val) {
    let port = parseInt(val, 10);
    if (isNaN(port)) {
      return val;
    }
    if (port >= 0) {
      return port;
    }
    return false;
}

function onError (error) {
    if (error.syscall !== "listen") {
      throw error;
    }
    let bind = typeof port === "string" ? "Pipe " + port : "Port " + port;
    switch (error.code) {
        case "EACCES":
            console.log(bind + " requires elevated privileges");
            process.exit(1);
            break;
        case "EADDRINUSE":
            console.log(bind + " is already in use");
            process.exit(1);
            break;
        default:
            throw error;
    }
}

function onListening() {
    console.log(`Server listening on port ${port}`);
}