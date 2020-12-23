import { Server } from 'socket.io';
import jwtHelper from '../helpers/jwt';
import { IUser } from '../models/user';
const socketAuth = require('socketio-auth');

//Client No Auth TimeOut
const timeOut = 10000;
/**----------------------------
 **      CUSTOM INTERFACES
 *-----------------------------**/
//ChatMessage Interface Model
interface chatMessage {
  senderId: string;
  recipientId: string;
  text: string;
  image: string;
  createdAt: Date;
}
//All Users On SocketServer Interface Model
interface UserData {
  users:IUser[]
  userSockets:  SocketIO.Socket[]
}
//All Users On SocketServer Data Array
var userData:UserData = {
  users: [],
  userSockets: []
};
//Token Payload for Authentication
interface Token {
  token:string
}
/**================================================================================================
 *                                         SOCKET.IO SERVER WITH AUTHENTICATION
 *================================================================================================**/
export default (io: Server) => {
  socketAuth(io, {
    /**============================================
     **               Authentication Middleware
     *=============================================**/
    authenticate: async (client_socket, payload:Token, callback) => {
      //client_socket.emit('connect',{"message":"Please Authorize","timeout":timeOut});
      const token:string = payload.token;
      try {
        jwtHelper.CheckJWT( token).then((data:[boolean,IUser])=>{
          //console.log("Data: ",data);
          if(data[0]==false){
            console.log("---------------------------------------------");
            console.log(`Socket ${client_socket.id} unauthorized.`);
            console.log("---------------------------------------------");
            return callback({ message: 'UNAUTHORIZED' });
          }else{
            //Authenticated --> Only add if the socket is not already added!
            var i = userData.userSockets.indexOf(client_socket);
            if (i === -1)
            {
              userData.users.push(data[1]);
              userData.userSockets.push(client_socket);
            };
            return callback(null, true);
          }
        });
      } catch (e) {
        console.log("---------------------------------------------");
        console.log("Error While Authenticating ",e);
        console.log("---------------------------------------------");
        console.log(`Socket ${client_socket.id} unauthorized.`);
        console.log("---------------------------------------------");
        return callback({ message: 'UNAUTHORIZED' });
      }
    },
    /**============================================
     **               Post Authentication Events
     *=============================================**/
    postAuthenticate: (client_socket) => {
      console.log(`Socket ${client_socket.id} authenticated.`);
      //TODO: USERS ONLINE LIST -- Completed
      // Just Showing the Data
        console.log("---------------------------------------------");
        console.log("user Connected: ",userData.users);
        console.log("---------------------------------------------");
      // SEND THE LIST OF CONNECTED USERS TO EVERYBODY AS CHANGES!
        //Group of Online Users
        client_socket.join('online_users');
      //Everybody recieves a new emit, as new user connects
        io.to('online_users').emit('online_users',userData.users);
      //Serve Users Connected List to User
        client_socket.on('online_users', async() => {
          //User Asking for UsersList
          client_socket.emit('online_users',userData.users);
        });

      ///TODO: CHAT MESSAGE --> SAVE TO DataBase Messages of User
        client_socket.on('chat_message', async( payload:chatMessage ) => {
          //io.emit('chat-message',payload.text);
          console.log("text: "+payload.text);
          userData.users.forEach(user => {
            if(user._id == payload.recipientId ||user._id == payload.senderId){
              //Client is this -->SEND MESSAGE TO HIM
              var i = userData.users.indexOf(user);
              if (i === -1)return;
              if(userData.userSockets[i] != client_socket){
                userData.userSockets[i].emit("chat_message",payload);}
            }
          });
        });
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
          if (i === -1)return; //If User isn't in our list!
          userData.userSockets.splice(i, 1);
          userData.users.splice(i,1);
          io.to('online_users').emit('online_users',userData.users);
          console.log("---------------------------------------------");
          console.log('Got disconnect!');
          console.log("---------------------------------------------");
    },
  })
}
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