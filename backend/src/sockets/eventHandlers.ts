import { Server } from 'socket.io';
import jwtHelper from '../helpers/jwt';
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
//Payload Interface Model
interface chatMessage {
  senderId: string;
  recipientId: string;
  text: string;
  image: string;
  createdAt: Date;
}
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
export default (io: Server) => {
  // Chatroom
  io.on('connection', function (client_socket) {
    console.log("---------------Headers---------- ");
    console.log(client_socket.handshake.headers);
    const [ valido, id,email] = jwtHelper.comprobarJWT( client_socket.handshake.headers['x-token'] );
    console.log("Valid: "+valido);
    // Verificar Authentication Of User
    if ( !valido ) { return client_socket.disconnect(); }
    else{
      //Means we have everything email,id  and Socket
      userData.clientIds.push(id);
      userData.clientEmails.push(email);
      userData.clientSockets.push(client_socket);
      //TODO: SEND THE LIST OF CONNECTED USERS TO EVERYBODY AS CHANGES!
        //HERE DO THAT!
      console.log("User Joined: ");
      client_socket.on('chat-message', async( payload:chatMessage ) => {
        //io.emit('chat-message',payload.text);
        console.log("text: "+payload.text);
        //await grabarMensaje( payload );
        io.to( payload.recipientId ).emit('chat-message', payload.text );
        client_socket.broadcast.emit('chat-message', "Message From Server");
      });
    
      // Keep track of the client_socket
      app.allSockets.push(client_socket);
    };
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