"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jwt_1 = __importDefault(require("../helpers/jwt"));
var Chat = require('./EventHandlers/Chat');
//var User = require('./EventHandlers/User');
// --------------------------------------
// -------- SOCKET.IO handlers ----------
// --------------------------------------
//@ts-ignore
var app = {
    //@ts-ignore
    allSockets: []
};
var userData = {
    //@ts-ignore
    clientIds: [],
    //@ts-ignore
    clientEmails: [],
    //@ts-ignore
    clientSockets: []
};
// structure inspired by
// https://stackoverflow.com/questions/20466129/how-to-organize-client_socket-handling-in-node-js-and-client_socket-io-app
exports.default = (io) => {
    // Chatroom
    io.on('connection', function (client_socket) {
        console.log("---------------Headers---------- ");
        console.log(client_socket.handshake.headers);
        const [valido, id, email] = jwt_1.default.comprobarJWT(client_socket.handshake.headers['x-token']);
        console.log("Valid: " + valido);
        // Verificar Authentication Of User
        if (!valido) {
            return client_socket.disconnect();
        }
        else {
            //Means we have everything email,id  and Socket
            userData.clientIds.push(id);
            userData.clientEmails.push(email);
            userData.clientSockets.push(client_socket);
            //TODO: SEND THE LIST OF CONNECTED USERS TO EVERYBODY AS CHANGES!
            //HERE DO THAT!
            console.log("User Joined: ");
            client_socket.on('chat-message', (payload) => __awaiter(this, void 0, void 0, function* () {
                //io.emit('chat-message',payload.text);
                console.log("text: " + payload.text);
                //await grabarMensaje( payload );
                io.to(payload.recipientId).emit('chat-message', payload.text);
                client_socket.broadcast.emit('chat-message', "Message From Server");
            }));
            // Keep track of the client_socket
            app.allSockets.push(client_socket);
        }
        ;
    });
};
/* //TODO: FUTURE BIND EVENT TO EVENTHANDLERS
    // Create event handlers for this client_socket
    var eventHandlers = {
        chat: new Chat(app, client_socket)
    };
    // Bind events to handlers
    for (var category in eventHandlers) {
      //@ts-ignore
        var handler = eventHandlers[category].handler;
        for (var event in handler) {
            client_socket.on(event, handler[event]);
        }
    }
      */ 
//# sourceMappingURL=eventHandlers.js.map