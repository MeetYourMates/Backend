import { Server } from 'socket.io';
import jwtHelper from '../helpers/jwt';
import { IUser } from '../models/user';

var Chat = require('./EventHandlers/Chat');
//var User = require('./EventHandlers/User');

// --------------------------------------
// -------- SOCKET.IO handlers ----------
// --------------------------------------

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

// structure inspired by
// https://stackoverflow.com/questions/20466129/how-to-organize-client_socket-handling-in-node-js-and-client_socket-io-app
//USE THIS FROM NOW ON --> https://www.npmjs.com/package/socketio-jwt

export default (io: Server) => {
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