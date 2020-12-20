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
const socketAuth = require('socketio-auth');
//Client No Auth TimeOut
const timeOut = 10000;
//All Users On SocketServer Data Array
var userData = {
    users: [],
    userSockets: []
};
/**================================================================================================
 *                                         SOCKET.IO SERVER WITH AUTHENTICATION
 *================================================================================================**/
exports.default = (io) => {
    socketAuth(io, {
        /**============================================
         **               Authentication Middleware
         *=============================================**/
        authenticate: (client_socket, payload, callback) => __awaiter(void 0, void 0, void 0, function* () {
            //client_socket.emit('connect',{"message":"Please Authorize","timeout":timeOut});
            const token = payload.token;
            try {
                jwt_1.default.CheckJWT(token).then((data) => {
                    //console.log("Data: ",data);
                    if (data[0] == false) {
                        console.log("---------------------------------------------");
                        console.log(`Socket ${client_socket.id} unauthorized.`);
                        console.log("---------------------------------------------");
                        return callback({ message: 'UNAUTHORIZED' });
                    }
                    else {
                        //Authenticated --> Only add if the socket is not already added!
                        var i = userData.userSockets.indexOf(client_socket);
                        if (i === -1) {
                            userData.users.push(data[1]);
                            userData.userSockets.push(client_socket);
                        }
                        ;
                        return callback(null, true);
                    }
                });
            }
            catch (e) {
                console.log("---------------------------------------------");
                console.log("Error While Authenticating ", e);
                console.log("---------------------------------------------");
                console.log(`Socket ${client_socket.id} unauthorized.`);
                console.log("---------------------------------------------");
                return callback({ message: 'UNAUTHORIZED' });
            }
        }),
        /**============================================
         **               Post Authentication Events
         *=============================================**/
        postAuthenticate: (client_socket) => {
            console.log(`Socket ${client_socket.id} authenticated.`);
            //TODO: USERS ONLINE LIST -- Completed
            // Just Showing the Data
            console.log("---------------------------------------------");
            console.log("user Connected: ", userData.users);
            console.log("---------------------------------------------");
            // SEND THE LIST OF CONNECTED USERS TO EVERYBODY AS CHANGES!
            //Group of Online Users
            client_socket.join('online_users');
            //Everybody recieves a new emit, as new user connects
            io.to('online_users').emit('online_users', userData.users);
            //Serve Users Connected List to User
            client_socket.on('online_users', () => __awaiter(void 0, void 0, void 0, function* () {
                //User Asking for UsersList
                client_socket.emit('online_users', userData.users);
            }));
            ///TODO: CHAT MESSAGE --> SAVE TO DataBase Messages of User
            client_socket.on('chat_message', (payload) => __awaiter(void 0, void 0, void 0, function* () {
                //io.emit('chat-message',payload.text);
                console.log("text: " + payload.text);
                userData.users.forEach(user => {
                    if (user._id == payload.recipientId || user._id == payload.senderId) {
                        //Client is this -->SEND MESSAGE TO HIM
                        var i = userData.users.indexOf(user);
                        if (i === -1)
                            return;
                        if (userData.userSockets[i] != client_socket) {
                            userData.userSockets[i].emit("chat_message", payload);
                        }
                    }
                });
            }));
        },
        /**============================================
         *               TimeOut Authentication
         *=============================================**/
        timeout: timeOut,
        /**============================================
         *               Disconnect Event
         *=============================================**/
        disconnect: (client_socket) => {
            console.log(`Socket ${client_socket.id} disconnected.`);
            client_socket.leave('online_users');
            var i = userData.userSockets.indexOf(client_socket);
            if (i === -1)
                return; //If User isn't in our list!
            userData.userSockets.splice(i, 1);
            userData.users.splice(i, 1);
            io.to('online_users').emit('online_users', userData.users);
            console.log("---------------------------------------------");
            console.log('Got disconnect!');
            console.log("---------------------------------------------");
        },
    });
};
//! DON'T DELETE FROM HERE BELOW ! 
/*
  // Chatroom
  io.on('connection', function (client_socket) {
    console.log("---------------SOCKET.IO HANDLER EVENTS LOGS---------- ");
    //Client or User is Authenticated
    jwtHelper.CheckJWT( client_socket.handshake.headers['x-token']).then((data:[boolean,IUser])=>{
      //console.log("Data: ",data);
      if(data[0]==false){
        return client_socket.disconnect();
      }else{
        //TODO: USERS ONLINE LIST -- Completed
        // User of this authenticated Socket
          userData.users.push(data[1]);
          userData.userSockets.push(client_socket);
        // Just Showing the Data
          console.log("user Connected: ",userData.users);
        // SEND THE LIST OF CONNECTED USERS TO EVERYBODY AS CHANGES!
          //Group of Online Users
          client_socket.join('online_users');
        //Everybody recieves a new emit, as new user connects
          io.to('online_users').emit('online_users',userData.users);
        //Serve Users Connected List to User
          client_socket.on('chat_message', async() => {
            //User Asking for UsersList
            client_socket.emit('online_users',userData.users);
          });

        ///TODO: CHAT MESSAGE --> SAVE TO DataBase Messages of User
          client_socket.on('chat_message', async( payload:chatMessage ) => {
            //io.emit('chat-message',payload.text);
            console.log("text: "+payload.text);
            userData.users.forEach(user => {
              if(user._id == payload.recipientId){
                //Client is this -->SEND MESSAGE TO HIM
                var i = userData.users.indexOf(user);
                if (i === -1)return;
                userData.userSockets[i].emit("chat_message",payload);
              }
            });
          });

        //TODO: HANDLE DISCONNECT --> SET STATE IN DB TO OFFLINE & SAVE MESSAGES FOR THIS CLIENT
        client_socket.on('disconnect', function() {
          var i = userData.userSockets.indexOf(client_socket);
          if (i === -1)return; //If User isn't in our list!
          userData.userSockets.splice(i, 1);
          userData.users.splice(i,1);
          io.to('online_users').emit('online_users',userData.users);
          console.log('Got disconnect!');
       });
      }
    });
  })
};

 //TODO: FUTURE BIND EVENT TO EVENTHANDLERS
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
//# sourceMappingURL=SocketHandler.js.map