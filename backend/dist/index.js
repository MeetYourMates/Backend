"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//Main Execution File of the Server
var app_1 = __importDefault(require("./app")); //Exported App importing here
//Execute Connection to BDD before launching the Server
require("./database");
var SocketHandler_1 = __importDefault(require("./sockets/SocketHandler"));
var debug = require("debug");
//Index.ts level constants
var cors = require('cors');
var packageJson = require('../package.json');
debug('ts-express:server');
//Error Handling - Server
var onError = function (error) {
    if (error.syscall !== 'listen')
        throw error;
    var bind = (typeof port === 'string') ? 'Pipe ' + port : 'Port ' + port;
    switch (error.code) {
        case 'EACCES':
            console.error(bind + " requires elevated privileges");
            process.exit(1);
        case 'EADDRINUSE':
            console.error(bind + " is already in use");
            process.exit(1);
        default:
            throw error;
    }
};
//Event Listening - Server
var onListening = function () {
    // tslint:disable-next-line:max-line-length
    console.log(packageJson.name + " " + packageJson.version + " listening on port " + port + "!");
    var addr = server.address();
    var bind = "port " + addr.port;
    debug("Listening on " + bind);
};
//Iniciamos Server
//app.use(cors());
app_1.default.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:4200");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With,Content-Type, Accept");
    next();
});
var server = require('http').Server(app_1.default);
var port = app_1.default.get('port');
server.on('error', onError);
server.on('listening', onListening);
//Only Websocket Connection Allowed, no Long Polling!
var options = {
    transports: ["websocket"],
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
        credentials: true
    }
};
//Socket IO --> socket.io handlers
var io = require('socket.io')(server, options);
//,'transports': ['websocket']
//var io 		= require('socket.io')(server);
// Socket.io all Events
SocketHandler_1.default(io);
server.listen(port);
//# sourceMappingURL=index.js.map