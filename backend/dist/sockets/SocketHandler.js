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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var chat_helper_1 = __importDefault(require("../helpers/chat_helper"));
var jwt_1 = __importDefault(require("../helpers/jwt"));
var socketAuth = require('socketio-auth');
//Client No Auth TimeOut (ms)
var timeOut = 10000;
//!All Users On SocketServer Data Array
var userData = {
    users: [],
    userSockets: [],
    userMatesIds: [],
    onlineUserMates: []
};
/**================================================================================================
 **                                         SOCKET.IO SERVER WITH AUTHENTICATION
 *================================================================================================**/
exports.default = (function (io) {
    socketAuth(io, {
        /**============================================
         **               Authentication Middleware
         *=============================================**/
        authenticate: function (client_socket, payload, callback) { return __awaiter(void 0, void 0, void 0, function () {
            var token;
            return __generator(this, function (_a) {
                token = payload.token;
                jwt_1.default.CheckJWT(token).then(function (data) {
                    //console.debug("Data: ",data);
                    if (data[0] == false) {
                        console.debug("---------------------------------------------");
                        console.debug("Socket " + client_socket.id + " unauthorized.");
                        console.debug("---------------------------------------------");
                        return callback({ message: 'UNAUTHORIZED' });
                    }
                    else {
                        //Authenticated --> Only add if the socket is not already added!
                        //TODO: FUTURE CHECK IF USER IS CONNECTED FROM DIFFERENT DEVICE OR SAME
                        //! BASED ON THAT WE SHOULD ALLOW HIM TO CONNECT OR NOT
                        //! RIGHTNOW SAME USER CAN CONNECT MULTIPLE TIMES FROM SAME DEVICE
                        //! VULNERIBILITY--> SEVERE POSSIBILITY OF SERVER SOCKET.IO OVERLOAD!
                        var i_1 = -1;
                        userData.users.forEach(function (user, index) {
                            if (user._id.equals(data[1]._id)) {
                                i_1 = index;
                                return;
                            }
                        });
                        if (i_1 == -1) {
                            //TODO: FUTURE --> OPTIMIZE HEAVILY FROM HERE BELOW, TOO INEFICIENT!!
                            //Get Mates of this user and add it to the userData
                            chat_helper_1.default.getMates(data[1]._id).then(function (resMates) {
                                //console.debug( "New User Authenticated..." );
                                userData.users.push(data[1]);
                                userData.userSockets.push(client_socket);
                                userData.userMatesIds.push(resMates);
                                //console.debug( "My Mates All: ", resMates );
                                //Need to filter for myself all of the users who are online for me
                                var filteredMates = [];
                                resMates.forEach(function (mateId) {
                                    //Online Users --> Search if My Mate is Online
                                    userData.users.forEach(function (userElement) {
                                        if (userElement._id.equals(mateId)) {
                                            filteredMates.push(mateId);
                                        }
                                    });
                                });
                                //console.debug( "My Mates Filtered: ", filteredMates );
                                userData.onlineUserMates.push(filteredMates);
                                //Notify Myself, who of my mates are online!
                                client_socket.emit('online_users', filteredMates);
                                //Have UserModel,UserSocket,UserMatesAll,UserMatesOnline
                                //? NOTIFY ALL OTHERS, I AM ONLINE AND ADD MYSELF IN THEIR ONLINE FILTERED LIST TOO!
                                new Promise(function (resolve, reject) {
                                    try {
                                        var k_1 = -1;
                                        userData.userMatesIds.forEach(function (usermates, index) {
                                            k_1 = -1;
                                            //console.debug( `User ${ userData.users[index].name } has usermates: ${ usermates } where searching for ${data[1]._id}` );
                                            usermates.forEach(function (usermate, index) {
                                                if (data[1]._id.equals(usermate)) {
                                                    k_1 = index;
                                                    return;
                                                }
                                            });
                                            //console.debug( "UserMate Index Found,k : ",k );
                                            if (k_1 != -1) {
                                                //Found Myself in there mates List
                                                userData.onlineUserMates[index].push(data[1]._id);
                                                userData.userSockets[index].emit('online_users', userData.onlineUserMates[index]);
                                                //console.debug( `User ${ userData.users[index].name } has updated Online usermates: ${ userData.onlineUserMates[index] }` );
                                            }
                                        });
                                        resolve(true);
                                        return;
                                    }
                                    catch (error) {
                                        reject(new Error(error));
                                        return;
                                    }
                                }).catch(function (err) {
                                    console.debug(err);
                                });
                                client_socket.emit('authenticated', '{"message":"Authenticated Succesfully"}');
                                return callback(null, true);
                            }).catch(function (err) {
                                console.debug(err);
                                return callback({ message: 'Server error, authentication failed fue to mates search error' }, false);
                            });
                        }
                        else {
                            console.debug("User Already Authenticated...");
                            return callback({ message: 'Single Socket Authentication' }, false);
                        }
                        ;
                    }
                }).catch(function (err) {
                    console.debug("---------------------------------------------");
                    console.debug('JWT ERROR PROMISE: ', err.message);
                    console.debug("---------------------------------------------");
                    console.debug("Socket " + client_socket.id + " unauthorized.");
                    console.debug("---------------------------------------------");
                    return callback({ message: 'UNAUTHORIZED' });
                });
                return [2 /*return*/];
            });
        }); },
        /**============================================
         **               Post Authentication Events
         *=============================================**/
        postAuthenticate: function (client_socket) {
            //console.debug( `Socket ${ client_socket.id } authenticated.` );
            var myIndex = userData.userSockets.indexOf(client_socket);
            // Just Showing the Data
            console.debug("---------------------------------------------");
            console.debug("user Connected: ", userData.users);
            console.debug("---------------------------------------------");
            // SEND THE LIST OF CONNECTED USERS TO EVERYBODY AS CHANGES!
            //Group of Online Users
            client_socket.join('connected_users');
            //Serve Users Connected List to User
            client_socket.on('online_users', function () { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    //User Asking for UsersOnlineMatesList
                    client_socket.emit('online_users', userData.onlineUserMates[myIndex]);
                    return [2 /*return*/];
                });
            }); });
            /**==============================================
             * ?  sendMessage function handler
             * *  does work asynchronously off the main thread
             * *  so that the main thread can attend other
             * *  messages from the same user in parallel
             *=============================================**/
            function sendMessage(payload) {
                return new Promise(function (resolve, reject) {
                    try {
                        //console.debug("Message: ",payload);
                        //Possible Validations that the payload is not null, or its field are non null. No server error but won't do anything
                        if (payload == null) {
                            reject(new Error("Payload null"));
                        }
                        if (payload.recipientId == null || payload.senderId == null || ((payload.text == null || payload.text == "") && (payload.image == null || payload.image == "")) || payload.createdAt == null) {
                            reject(new Error("Payload not correct"));
                            return;
                        }
                        //We cannot have the user send message to himself!
                        if (payload.recipientId == payload.senderId) {
                            reject(new Error("user send message to himself"));
                            return;
                        }
                        //We cannot allow users to send message as senderId other than themself!
                        if (userData.users[userData.userSockets.indexOf(client_socket)]._id != payload.senderId) {
                            reject(new Error("senderId different than client, invalid"));
                            return;
                        }
                        ;
                        // If validations Okay, than we search for the user, If the Recipiend is found than we send the message
                        userData.users.forEach(function (user, indexCurrent) {
                            if (user._id == payload.recipientId) {
                                //Client is this -->SEND MESSAGE TO HIM
                                userData.userSockets[indexCurrent].emit("chat_message", payload);
                            }
                        });
                        //If the recipiend Id is not found, but it may exist in the database we need to save the message from this user
                        //So that when the recipient reconnects he can see the messages sent to him while offline
                        chat_helper_1.default.saveMessage(payload).catch(function (err) {
                            reject(err);
                            return;
                        });
                        resolve(true);
                        return;
                    }
                    catch (error) {
                        reject(new Error(error));
                        return;
                    }
                });
            }
            ;
            /**==============================================
             * ?  getChatHistory function handler
             * *  does work asynchronously off the main thread
             * *  so that the main thread can attend other
             * *  messages from the same user in parallel
             *=============================================**/
            //Payload must contain the 
            function getChatHistory() {
                //console.trace( "getChatHistory Executed!" );
                return new Promise(function (resolve, reject) {
                    try {
                        var userId = userData.users[userData.userSockets.indexOf(client_socket)]._id;
                        //? Gets all of the Private Chats, that this user has talked with.
                        //? all of the dirty work of putting in correct list per user will be done in frontend
                        //? Extra efficient on server and balances the workload to clientSide!
                        //@ts-nocheck
                        chat_helper_1.default.getChatHistory(userId).then(function (privateChatsResult) {
                            //We have the messages on success, we will send this messages to the client
                            client_socket.emit("private_chat_history", privateChatsResult);
                            resolve(true);
                            return;
                        }).catch(function (err) {
                            reject(err);
                            return;
                        });
                    }
                    catch (error) {
                        reject(new Error(error));
                        return;
                    }
                });
            }
            ;
            /**==============================================
            * ?  Private chat messages event handler
            * *   using sendMessage as a Promise to do
            * *   work asynchronously!
            *=============================================**/
            client_socket.on('chat_message', function (payload) { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    sendMessage(payload).catch(function (err) {
                        console.debug("---------------------------------------------");
                        console.debug('sendMessage Promise: ', err.message);
                        console.debug("---------------------------------------------");
                        console.debug("Socket " + client_socket.id + " badMessage Request.");
                        console.debug("---------------------------------------------");
                    });
                    return [2 /*return*/];
                });
            }); });
            /**==============================================
               * ?  User historial private messages event handler
               * *  using sendChatHistory as a Promise to do
               * *  work asynchronously! When finished should
               * *  send user his chat history
               *=============================================**/
            client_socket.on('private_chat_history', function () { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    getChatHistory().catch(function (err) {
                        console.debug("---------------------------------------------");
                        console.debug('getChatHistory returned Promise: ', err.message);
                        console.debug("---------------------------------------------");
                        console.debug("Socket " + client_socket.id + " get private_chat_history, something bad occured...");
                        console.debug("---------------------------------------------");
                    });
                    return [2 /*return*/];
                });
            }); });
            ///TODO: GROUP CHAT MESSAGE --> Not Finished!!
            /**==============================================
              * ?  Group chat messages event handler
              * *  using sendMessage as a Promise to do
              * *  work asynchronously!
              *=============================================**/
            client_socket.on('group_chat_message', function (payload) { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    sendMessage(payload).catch(function (err) {
                        console.debug("---------------------------------------------");
                        console.debug('sendMessage Promise: ', err.message);
                        console.debug("---------------------------------------------");
                        console.debug("Socket " + client_socket.id + " badMessage Request.");
                        console.debug("---------------------------------------------");
                    });
                    return [2 /*return*/];
                });
            }); });
        },
        /**============================================
         *               TimeOut Authentication
         *=============================================**/
        timeout: timeOut,
        /**============================================
         *               Disconnect Event
         *=============================================**/
        disconnect: function (client_socket) {
            console.debug("Socket " + client_socket.id + " disconnected.");
            client_socket.leave('online_users');
            var i = userData.userSockets.indexOf(client_socket);
            if (i === -1) {
                console.debug("------------------------------------------------------");
                console.debug('Got disconnection due to Timeout,no authentication!');
                console.debug("------------------------------------------------------");
                return; //If User isn't in our list!
            }
            //First we save the current Disconnection Time as LastActive
            //Date.now() TimeStamp in miliseconds
            chat_helper_1.default.setLastActiveAsNow(userData.users[i]._id).finally(function () {
                //All Users who have me as there mate, need to tell them I am Offline
                new Promise(function (resolve, reject) {
                    try {
                        var k_2 = -1;
                        userData.onlineUserMates.forEach(function (onlineUserMates, index) {
                            //
                            //i = onlineUserMates.indexOf( userData.users[i]._id );
                            k_2 = -1;
                            onlineUserMates.forEach(function (onlineUsermate, index2) {
                                if (userData.users[i]._id.equals(onlineUsermate)) {
                                    k_2 = index2;
                                    return;
                                }
                            });
                            if (k_2 != -1) {
                                //Found Myself in there mates List
                                userData.onlineUserMates[index].splice(k_2, 1);
                                userData.userSockets[index].emit('online_users', userData.onlineUserMates[index]);
                            }
                        });
                        resolve(true);
                        return;
                    }
                    catch (error) {
                        reject(new Error(error));
                        return;
                    }
                }).catch(function (err) {
                    console.debug(err);
                });
                //Delete the User from OnlineUsers List and Notify Other Users!
                userData.userSockets.splice(i, 1);
                userData.users.splice(i, 1);
                userData.onlineUserMates.splice(i, 1);
                userData.userMatesIds.splice(i, 1);
                //io.to( 'online_users' ).emit( 'online_users', userData.users );
                console.debug("---------------------------------------------");
                console.debug('Got disconnection From User!');
                console.debug("---------------------------------------------");
            });
        },
    });
});
//! DON'T DELETE FROM HERE BELOW !
/*
  // Chatroom
  io.on('connection', function (client_socket) {
    console.debug("---------------SOCKET.IO HANDLER EVENTS debugS---------- ");
    //Client or User is Authenticated
    jwtHelper.CheckJWT( client_socket.handshake.headers['x-token']).then((data:[boolean,IUser])=>{
      //console.debug("Data: ",data);
      if(data[0]==false){
        return client_socket.disconnect();
      }else{
        //TODO: USERS ONLINE LIST -- Completed
        // User of this authenticated Socket
          userData.users.push(data[1]);
          userData.userSockets.push(client_socket);
        // Just Showing the Data
          console.debug("user Connected: ",userData.users);
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
            console.debug("text: "+payload.text);
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
          console.debug('Got disconnect!');
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