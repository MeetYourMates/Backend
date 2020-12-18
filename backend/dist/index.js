"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//Main Execution File of the Server
const app_1 = __importDefault(require("./app")); //Exported App importing here
//Execute Connection to BDD before launching the Server
require("./database");
const SocketHandler_1 = __importDefault(require("./sockets/SocketHandler"));
const debug = require("debug");
//Index.ts level constants
const packageJson = require('../package.json');
debug('ts-express:server');
//Error Handling - Server
const onError = (error) => {
    if (error.syscall !== 'listen')
        throw error;
    let bind = (typeof port === 'string') ? 'Pipe ' + port : 'Port ' + port;
    switch (error.code) {
        case 'EACCES':
            console.error(`${bind} requires elevated privileges`);
            process.exit(1);
        case 'EADDRINUSE':
            console.error(`${bind} is already in use`);
            process.exit(1);
        default:
            throw error;
    }
};
//Event Listening - Server
const onListening = () => {
    // tslint:disable-next-line:max-line-length
    console.log(`${packageJson.name} ${packageJson.version} listening on port ${port}!`);
    let addr = server.address();
    let bind = `port ${addr.port}`;
    debug(`Listening on ${bind}`);
};
//Iniciamos Server
var server = require('http').Server(app_1.default);
const port = app_1.default.get('port');
server.on('error', onError);
server.on('listening', onListening);
//Socket IO --> socket.io handlers
//Only Websocket Connection Allowed, no Long Polling!
var io = require('socket.io')(server, {
    'transports': ['websocket']
});
// Socket.io all Events
SocketHandler_1.default(io);
server.listen(port);
//# sourceMappingURL=index.js.map