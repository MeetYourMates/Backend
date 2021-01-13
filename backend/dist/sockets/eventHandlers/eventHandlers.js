"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bar_1 = __importDefault(require("./bar"));
const foo_1 = __importDefault(require("./foo"));
// --------------------------------------
// -------- SOCKET.IO handlers ----------
// --------------------------------------
const app = {
    allSockets: []
};
// structure inspired by
// https://stackoverflow.com/questions/20466129/how-to-organize-socket-handling-in-node-js-and-socket-io-app
exports.default = (io) => {
    // Chatroom
    io.on('connection', (socket) => {
        const eventHandlers = [
            foo_1.default(app, socket),
            bar_1.default(app, socket)
        ];
        // Bind events to handlers
        eventHandlers.forEach(handler => {
            for (let eventName in handler) {
                socket.on(eventName, handler[eventName]);
            }
        });
        // Keep track of the socket
        app.allSockets.push(socket);
    });
};
//# sourceMappingURL=eventHandlers.js.map