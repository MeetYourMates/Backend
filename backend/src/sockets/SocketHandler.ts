import { Server } from 'socket.io';
import { default as chatHelper, default as chat_helper } from '../helpers/chat_helper';
import jwtHelper from '../helpers/jwt';
import { IMessage } from '../models/message';
import { IUser } from '../models/user';
const socketAuth = require('socketio-auth');

//Client No Auth TimeOut (ms)
const timeOut = 10000;
/**================================================================================================
 **                                           CUSTOM INTERFACES
 *================================================================================================**/
//!ChatMessage Interface Model
/* interface chatMessage {
  senderId: string;
  recipientId: string;
  text: string;
  image: string;
  createdAt: Date;
} */
//!All Users On SocketServer Interface Model
interface UserData {
  users:IUser[]
  userSockets:  SocketIO.Socket[]
}
//!All Users On SocketServer Data Array
var userData:UserData = {
  users: [],
  userSockets: []
};
//!Token Payload for Authentication
interface Token {
  token:string
}
/**================================================================================================
 **                                         SOCKET.IO SERVER WITH AUTHENTICATION
 *================================================================================================**/
export default (io: Server) => {
  socketAuth(io, {
    /**============================================
     **               Authentication Middleware
     *=============================================**/
    authenticate: async (client_socket, payload:Token, callback) => {
      //client_socket.emit('connect',{"message":"Please Authorize","timeout":timeOut});
      const token:string = payload.token;
        jwtHelper.CheckJWT( token).then((data:[boolean,IUser])=>{
          console.debug("Data: ",data);
          if(data[0]==false){
            console.debug("---------------------------------------------");
            console.debug(`Socket ${client_socket.id} unauthorized.`);
            console.debug("---------------------------------------------");
            return callback({ message: 'UNAUTHORIZED' });
          }else{
            //Authenticated --> Only add if the socket is not already added!
            var i = userData.users.indexOf( data[1] );
            if (i === -1)
            {
              userData.users.push(data[1]);
              userData.userSockets.push(client_socket);
            };
            return callback(null, true);
          }
        }).catch((err)=>{
          console.debug("---------------------------------------------");
          console.debug('JWT ERROR PROMISE: ', err.message);
          console.debug("---------------------------------------------");
          console.debug(`Socket ${client_socket.id} unauthorized.`);
          console.debug("---------------------------------------------");
          return callback({ message: 'UNAUTHORIZED' });
        });
    },
    /**============================================
     **               Post Authentication Events
     *=============================================**/
    postAuthenticate: (client_socket) => {
      console.debug(`Socket ${client_socket.id} authenticated.`);
      //TODO: USERS ONLINE LIST -- Completed
      // Just Showing the Data
        console.debug("---------------------------------------------");
        console.debug("user Connected: ",userData.users);
        console.debug("---------------------------------------------");
      // SEND THE LIST OF CONNECTED USERS TO EVERYBODY AS CHANGES!
        //Group of Online Users
        client_socket.join('online_users');
      //Everybody recieves a new emit, as new user connects
        io.to('online_users').emit('online_users',userData.users);
      //Serve Users Connected List to User
        client_socket.on('online_users', async() => {
          //User Asking for UsersList
          client_socket.emit('online_users',userData.users);
        } );
      
        /**==============================================
         * ?  sendMessage function handler
         * *  does work asynchronously off the main thread
         * *  so that the main thread can attend other
         * *  messages from the same user in parallel
         *=============================================**/
        function sendMessage( payload:IMessage){
          return new Promise((resolve,reject)=>{
              try {
                console.debug("Message: ",payload);
                //Possible Validations that the payload is not null, or its field are non null. No server error but won't do anything
                if(payload==null){resolve(true);}
                if(payload.recipientId==null ||payload.senderId==null || ((payload.text ==null|| payload.text=="") && (payload.image==null|| payload.image==""))|| payload.createdAt==null){resolve(true);}
                //We cannot have the user send message to himself!
                if ( payload.recipientId == payload.senderId ) { resolve( true ); }
                //We cannot allow users to send message as senderId other than themself!
                if( userData.users[userData.userSockets.indexOf( client_socket )]._id != payload.senderId ){ resolve( true );}

                let isRecipientOnline = false;
                // If validations Okay, than we search for the user, If the Recipiend is found than we send the message
                userData.users.forEach((user,indexCurrent)=> {
                  if(user._id == payload.recipientId){
                    //Client is this -->SEND MESSAGE TO HIM
                    userData.userSockets[indexCurrent].emit( "chat_message", payload );
                    isRecipientOnline = true;
                  }
                });
                //If the recipiend Id is not found, but it may exist in the database we need to save the message from this user
                //So that when the recipient reconnects he can see the messages sent to him while offline
                chat_helper.saveMessage(payload,isRecipientOnline);
                
                resolve( true);
              } catch (error) {
                reject(new Error(error));
              }
          });
      };
      
        /**==============================================
         * ?  getChatHistory function handler
         * *  does work asynchronously off the main thread
         * *  so that the main thread can attend other
         * *  messages from the same user in parallel
         *=============================================**/
        //Payload must contain the 
        function getChatHistory(): Promise<any>{
          return new Promise((resolve,reject)=>{
            try
            {
              let userId:String = userData.users[userData.userSockets.indexOf( client_socket )]._id;
                //? Gets all of the Private Chats, that this user has talked with.
                //? all of the dirty work of putting in correct list per user will be done in frontend
                //? Extra efficient on server and balances the workload to clientSide!
              //@ts-nocheck
              chat_helper.getChatHistory( userId ).then( (privateChatsResult) =>
              {
                //We have the messages on success, we will send this messages to the client
                client_socket.emit("private_chat_history",privateChatsResult);
                resolve(true);
              } ).catch( (err) =>
              {
                reject(err);
              });
              } catch (error) {
                reject(new Error(error));
              }
          });
        };

        /**==============================================
         * ?  Private chat messages event handler
         * *   using sendMessage as a Promise to do 
         * *   work asynchronously!
         *=============================================**/
        client_socket.on('chat_message', async( payload:IMessage ) => {
          sendMessage(payload).catch((err)=>{
            console.debug("---------------------------------------------");
            console.debug('sendMessage Promise: ', err.message);
            console.debug("---------------------------------------------");
            console.debug(`Socket ${client_socket.id} badMessage Request.`);
            console.debug("---------------------------------------------");
          });
        } );
      
      /**==============================================
         * ?  User historial private messages event handler
         * *  using sendChatHistory as a Promise to do 
         * *  work asynchronously! When finished should
         * *  send user his chat history
         *=============================================**/
        client_socket.on('private_chat_history', async() => {
          getChatHistory().catch((err)=>{
            console.debug("---------------------------------------------");
            console.debug('getChatHistory returned Promise: ', err.message);
            console.debug("---------------------------------------------");
            console.debug(`Socket ${client_socket.id} get private_chat_history, something bad occured...`);
            console.debug("---------------------------------------------");
          });
        } );
      
      ///TODO: GROUP CHAT MESSAGE --> Not Finished!!
       /**==============================================
         * ?  Group chat messages event handler
         * *  using sendMessage as a Promise to do 
         * *  work asynchronously!
         *=============================================**/
      client_socket.on('group_chat_message', async( payload:IMessage ) => {
        sendMessage(payload).catch((err)=>{
          console.debug("---------------------------------------------");
          console.debug('sendMessage Promise: ', err.message);
          console.debug("---------------------------------------------");
          console.debug(`Socket ${client_socket.id} badMessage Request.`);
          console.debug("---------------------------------------------");
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
      console.debug(`Socket ${client_socket.id} disconnected.`);
      client_socket.leave('online_users');
      var i = userData.userSockets.indexOf(client_socket);
          if (i === -1)return; //If User isn't in our list!
          //First we save the current Disconnection Time as LastActive
          //Date.now() TimeStamp in miliseconds
      chatHelper.setLastActiveAsNow( userData.users[i]._id ).finally( () =>
      {
        //Delete the User from OnlineUsers List and Notify Other Users!
        userData.userSockets.splice( i, 1 );
        userData.users.splice( i, 1 );
        io.to( 'online_users' ).emit( 'online_users', userData.users );
        console.debug( "---------------------------------------------" );
        console.debug( 'Got disconnect!' );
        console.debug( "---------------------------------------------" );
      } );
    },
  })
}
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