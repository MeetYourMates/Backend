import SocketIO, { Server } from 'socket.io';
import { default as chatHelper } from '../helpers/chat_helper';
import jwtHelper from '../helpers/jwt';
import { IMessage } from '../models/message';
import {IUserModel} from "../models/user";
const socketAuth = require( 'socketio-auth' );

//Client No Auth TimeOut (ms)
const timeOut = 10000;
/**================================================================================================
 **                                           CUSTOM INTERFACES
 *================================================================================================**/
//!All Users On SocketServer Interface Model
interface UserData
{
  usersId: Array<string>,
  userSockets: SocketIO.Socket[],
  userMatesIds: Array<Array<String>>,
  onlineUserMates: Array<Array<String>>,
}
//!All Users On SocketServer Data Array
let userData: UserData = {
  usersId: [],
  userSockets: [],
  userMatesIds: [],
  onlineUserMates: []
};
//!Token Payload for Authentication
interface Token
{
  token: string
}

interface MateStatus {
  _id: string
}

/**================================================================================================
 **                                         SOCKET.IO SERVER WITH AUTHENTICATION
 *================================================================================================**/
export default ( io: Server ) =>
{
  socketAuth( io, {
    /**============================================
     **               Authentication Middleware
     *=============================================**/
    authenticate: async ( client_socket, payload: Token, callback ) =>
    {
      //client_socket.emit('connect',{"message":"Please Authorize","timeout":timeOut});
      const token: string = payload.token;
      jwtHelper.CheckJWT( token ).then( ( data: [boolean, string] ) =>
      {
        //console.debug("Data: ",data);
        if ( data[0] == false )
        {
          console.debug( "---------------------------------------------" );
          console.debug( `Socket ${ client_socket.id } unauthorized.` );
          console.debug( "---------------------------------------------" );
          return callback( { message: 'UNAUTHORIZED' } );
        } else
        {
          //Authenticated --> Only add if the socket is not already added!
          //TODO: IN FUTURE CHECK IF USER IS CONNECTED FROM DIFFERENT DEVICE OR SAME
          let i = userData.usersId.indexOf(data[1]);
          if ( i == -1 )
          {
            //Get Mates of this user and add it to the userData
            chatHelper.getMates( data[1]).then( ( resMates ) =>
            {
              //console.debug( "New User Authenticated..." );
              userData.usersId.push( data[1] );
              userData.userSockets.push( client_socket );
              userData.userMatesIds.push( resMates );
              //console.debug( "My Mates All: ", resMates );
              //Need to filter for myself all of the users who are online for me
              let filteredMates: String[] = [];
              resMates.forEach( mateId =>
              {
                //Online Users --> Search if any of My Mates are Online
                let tempIndex = userData.usersId.indexOf(mateId.toString());
                if(tempIndex!=-1){
                  filteredMates.push( mateId );
                }
                } );

              //console.debug( "My Mates Filtered: ", filteredMates );
              userData.onlineUserMates.push( filteredMates );
              //Notify Myself, who of my mates are online!
              client_socket.emit( 'mates_status', filteredMates );
              //Have UserModel,UserSocket,UserMatesAll,UserMatesOnline

              //? NOTIFY ALL OTHERS, I AM ONLINE AND ADD MYSELF IN THEIR ONLINE FILTERED LIST TOO!
              new Promise( ( resolve, reject ) =>
              {
                try
                {
                  let k = -1;
                  userData.userMatesIds.forEach( ( matesArray, index ) =>
                  {
                    k = matesArray.indexOf(data[1]);
                    //If me, who just connected is someones elses mates, and he/she connected --> Notify!
                    if ( k != -1 )
                    {
                      //Found Myself in there mates List
                      userData.onlineUserMates[index].push( data[1]);
                      userData.userSockets[index].emit( 'mates_status', userData.onlineUserMates[index] );
                      //console.debug( `User ${ userData.users[index].name } has updated Online usermates: ${ userData.onlineUserMates[index] }` );
                    }
                  } );
                  resolve( true ); return;
                } catch ( error )
                {
                  reject( new Error( error ) );
                  return;
                }
              } ).catch( ( err ) =>
              {
                console.debug( err );
              } );
              client_socket.emit( 'authentication', "{'message':'Authenticated Successfully'}" );
              return callback( null, true );
            } ).catch( ( err ) =>
            {
              console.debug( err );
              return callback( { message: 'Server error, authentication failed fue to mates search error' }, false );
            } );
          } else
          {
            console.debug( "User Already Authenticated..." );
            return callback( { message: 'Single Socket Authentication' }, false );
          }

        }
      } ).catch( ( err ) =>
      {
        console.debug( "---------------------------------------------" );
        console.debug( 'JWT ERROR PROMISE: ', err.message );
        console.debug( "---------------------------------------------" );
        console.debug( `Socket ${ client_socket.id } unauthorized.` );
        console.debug( "---------------------------------------------" );
        return callback( { message: 'UNAUTHORIZED' } );
      } );
    },
    /**============================================
     **               Post Authentication Events
     *=============================================**/
    postAuthenticate: ( client_socket ) =>
    {
      //console.debug( `Socket ${ client_socket.id } authenticated.` );
      // Just Showing the Data
      console.debug( "---------------------------------------------" );
      console.debug( "user Connected: ", userData.usersId );
      console.debug( "---------------------------------------------" );
      // SEND THE LIST OF CONNECTED USERS TO EVERYBODY AS CHANGES!
      //Group of Online Users
      client_socket.join( 'connected_users' );

      //Serve Users Connected List to User
      client_socket.on( 'mates_status', async () =>
      {
        //User Asking for UsersOnlineMatesList
        client_socket.emit( 'mates_status', userData.onlineUserMates[userData.userSockets.indexOf( client_socket )] );
      } );

      /**==============================================
       * ?  sendMessage function handler
       * *  does work asynchronously off the main thread
       * *  so that the main thread can attend other
       * *  messages from the same user in parallel
       *=============================================**/
      function sendMessage ( payload: IMessage )
      {
        return new Promise( ( resolve, reject ) =>
        {
          try
          {
            let myIndex = userData.userSockets.indexOf( client_socket );
            //console.debug("Message: ",payload);
            //Possible Validations that the payload is not null, or its field are non null. No server error but won't do anything
            if ( payload == null ) { reject( new Error( "Payload null" ) ); }
            if ( payload.recipientId == null || payload.senderId == null || ( ( payload.text == null || payload.text == "" ) && ( payload.image == null || payload.image == "" ) ) || payload.createdAt == null )
            { reject( new Error( "Payload not correct" ) ); return; }
            //We cannot have the user send message to himself!
            if ( payload.recipientId == payload.senderId ) { reject( new Error( "user send message to himself" ) ); return; }
            //We cannot allow users to send message as senderId other than themself!
            if ( userData.usersId[myIndex] != payload.senderId )
            { reject( new Error( "senderId different than client, invalid" ) ); return; }

            // If validations Okay, than we search for the user, If the Recipient is found than we send the message
            let recipientIndex:number = userData.usersId.indexOf(payload.recipientId);
            //Check if Recipient Online & send the message...
            if(recipientIndex!=-1){
              //Check if sender is already his mate?
              let senderIndexInRecipient:number = userData.userMatesIds[recipientIndex].indexOf(payload.senderId);
              if(senderIndexInRecipient!=-1){
                //Sender already a mate of recipient
                userData.userSockets[recipientIndex].emit("private_chat_message", payload);
              }else{
                //Sender is not mate of recipient
                // send him a request to add him as a new mate + message
                /*{
                    "user":"UserObject",
                    "message":["messageObject"]
                  }*/
                chatHelper.getUser(payload.senderId).then((resUser)=>{
                  //Now they are mates
                  //Add mate to recipient
                  userData.userMatesIds[recipientIndex].push(resUser._id);
                  userData.onlineUserMates[recipientIndex].push(resUser._id);
                  //Add recipient as mate to Sender
                  userData.userMatesIds[myIndex].push(payload.recipientId);
                  //Recipient is Online!!
                  userData.onlineUserMates[myIndex].push(payload.recipientId);
                  //Send message + mate(User) to recipient
                  let newMate: { message: IMessage; user: IUserModel } = {
                    'user': resUser,
                    'message': payload
                  };
                  userData.userSockets[recipientIndex].emit("new_mate", newMate);
                }).catch((err)=>{
                  reject(err); return;
                });
              }
            }
            //Save the message in Database for both Sender & Recipient
            chatHelper.saveMessage( payload ).catch( function ( err )
            {
              reject( err ); return;
            } );

            resolve( true ); return;
          } catch ( error )
          {
            reject( new Error( error ) );
            return;
          }
        } );
      }
      /**==============================================
       * ?  Private chat messages event handler
       * *   using sendMessage as a Promise to do
       * *   work asynchronously!
       *=============================================**/
      client_socket.on( 'private_chat_message', async ( payload: IMessage ) =>
      {
        sendMessage( payload ).catch( ( err ) =>
        {
          console.debug( "---------------------------------------------" );
          console.debug( 'sendMessage Promise: ', err.message );
          console.debug( "---------------------------------------------" );
          console.debug( `Socket ${ client_socket.id } badMessage Request.` );
          console.debug( "---------------------------------------------" );
        } );
      } );
      /**==============================================
       * ?  getChatHistory function handler
       * *  does work asynchronously off the main thread
       * *  so that the main thread can attend other
       * *  messages from the same user in parallel
       *=============================================**/
      //Payload must contain the 
      function getChatHistory (): Promise<any>
      {
        //console.trace( "getChatHistory Executed!" );
        return new Promise( ( resolve, reject ) =>
        {
          try
          {
            let userId: string = userData.usersId[userData.userSockets.indexOf( client_socket )];
            //? Gets all of the Private Chats, that this user has talked with.
            //? all of the dirty work of putting in correct list per user will be done in frontend
            //? Extra efficient on server and balances the workload to clientSide!

            chatHelper.getChatHistory( userId ).then( ( privateChatsResult ) =>
            {
              //We have the messages on success, we will send this messages to the client
              client_socket.emit( "private_chat_history", privateChatsResult );
              resolve( true );
              return;
            } ).catch( ( err ) =>
            {
              reject( err );
              return;
            } );
          } catch ( error )
          {
            reject( new Error( error ) );
            return;
          }
        } );
      }
      /**==============================================
       * ?  User historical private messages event handler
       * *  using sendChatHistory as a Promise to do
       * *  work asynchronously! When finished should
       * *  send user his chat history
       *=============================================**/
      client_socket.on( 'private_chat_history', async () =>
      {
        getChatHistory().catch( ( err ) =>
        {
          console.debug( "---------------------------------------------" );
          console.debug( 'getChatHistory returned Promise: ', err.message );
          console.debug( "---------------------------------------------" );
          console.debug( `Socket ${ client_socket.id } get private_chat_history, something bad occurred...` );
          console.debug( "---------------------------------------------" );
        } );
      } );
      /**==============================================
       * ?  check Mate Status function handler
       * *  does work asynchronously, so can attend
       * *  messages from the same user in parallel
       *=============================================**/
      //Payload must contain the
      function checkMateStatus (payload: MateStatus): Promise<any>
      {
        //console.trace( "getChatHistory Executed!" );
        return new Promise( ( resolve, reject ) =>
        {
          try
          {
            //Check if id is non null and string
            if(payload._id==null){
              reject(new Error("checkMateStatus: payload must contain _id "));return;
            }
            let mateStatus: { _id: string; status: boolean } = {
              '_id':payload._id,
              'status':true
            };
            if(userData.usersId.indexOf(payload._id)!=-1){
                //User is Online
                //We have the messages on success, we will send this messages to the client
                client_socket.emit( "check_mate_status", mateStatus );
              }else{
                //User is Offline
                mateStatus.status=false;
                client_socket.emit( "check_mate_status", mateStatus );
              }
              resolve( true );
              return;
          } catch ( error )
          {
            reject( new Error( error ) );
            return;
          }
        } );
      }
      /**==============================================
       * ?  check mate status event handler
       * *  using checkMateStatus as a Promise to do
       * *  work asynchronously! When finished should
       * *  send user, mates the status he asked for
       *=============================================**/
      client_socket.on( 'check_mate_status', async (payload: MateStatus) =>
      {
        checkMateStatus(payload).catch( ( err ) =>
        {
          console.debug( "---------------------------------------------" );
          console.debug( 'checkMateStatus returned Promise: ', err.message );
          console.debug( "---------------------------------------------" );
          console.debug( `Socket ${ client_socket.id } get checkMateStatus, something bad occurred...` );
          console.debug( "---------------------------------------------" );
        } );
      } );


      ///TODO: GROUP CHAT MESSAGE --> Not Finished!!
      /**==============================================
        * ?  Group chat messages event handler
        * *  using sendMessage as a Promise to do 
        * *  work asynchronously!
        *=============================================**/
      client_socket.on( 'group_chat_message', async ( payload: IMessage ) =>
      {
        sendMessage( payload ).catch( ( err ) =>
        {
          console.debug( "---------------------------------------------" );
          console.debug( 'sendMessage Promise: ', err.message );
          console.debug( "---------------------------------------------" );
          console.debug( `Socket ${ client_socket.id } badMessage Request.` );
          console.debug( "---------------------------------------------" );
        } );
      } );
      /*------------------POST AUTHENTICATION FINISHES HERE........................................*/
    },
    /**============================================
     *               TimeOut Authentication
     *=============================================**/
    timeout: timeOut,
    /**============================================
     *               Disconnect Event
     *=============================================**/
    disconnect: ( client_socket ) =>
    {
      console.debug( `Socket ${ client_socket.id } disconnected.` );
      client_socket.leave( 'online_users' );
      const i = userData.userSockets.indexOf( client_socket );
      if ( i === -1 )
      {
        console.debug( "------------------------------------------------------" );
        console.debug( 'Got disconnection due to Timeout,no authentication!' );
        console.debug( "------------------------------------------------------" );
        return; //If User isn't in our list!
      }
      //First we save the current Disconnection Time as LastActive
      //Date.now() TimeStamp in milliseconds
      chatHelper.setLastActiveAsNow( userData.usersId[i] ).finally( () =>
      {
        //All Users who have me as there mate, need to tell them I am Offline
        new Promise( ( resolve, reject ) =>
        {
          try
          {
            let k = -1;
            userData.onlineUserMates.forEach( ( onlineUserMates, index ) =>
            {
              //Search myself in the list of Online UserMates and splice
              k=-1;
              k = onlineUserMates.indexOf(userData.usersId[i]);
              if(k!=-1){
                //Splice and move on
                userData.onlineUserMates[index].splice(k,1);
                userData.userSockets[index].emit('mates_status',userData.onlineUserMates[index]);
              }
            } );
            resolve( true ); return;
          } catch ( error )
          {
            reject( new Error( error ) );
            return;
          }
        } ).catch( ( err ) =>
        {
          console.debug( err );
        } );

        //Delete the User from OnlineUsers List and Notify Other Users!
        userData.userSockets.splice( i, 1 );
        userData.usersId.splice( i, 1 );
        userData.onlineUserMates.splice( i, 1 );
        userData.userMatesIds.splice( i, 1 );
        //io.to( 'online_users' ).emit( 'online_users', userData.users );
        console.debug( "---------------------------------------------" );
        console.debug( 'Got disconnection From User!' );
        console.debug( "---------------------------------------------" );
      } );
    },
  } )
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
        //Everybody receives a new emit, as new user connects
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