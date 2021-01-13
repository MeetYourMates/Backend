import Message, { IMessage } from "../models/message";
import PrivateChat, { IPrivateChat } from "../models/privateChat";
import User, {IUserModel} from "../models/user";

/// Finished: setLastActiveAsNow on a User
/**===========================================================
 * ?  setLastActiveAsNow function stamps the
 * *   the given user with Current Time on the
 * *   field lastActive. As a Promise to do 
 * *   work asynchronously!
 *============================================================**/
function setLastActiveAsNow(idUser:string){
    return new Promise((resolve,reject )=>{
        try {
            var query = { "_id": idUser };
           User.updateOne(query,{ lastActiveAt: Date.now()}).then((res)=>{
                if(res.nModified==0){
                    reject( new Error( "No User Found to add the TimeStamp of lastActive with this id: " + idUser ) );
                    return;
                }
               resolve( true );
               return;
            });
        } catch (error) {
            ////console.debug("Some error while setting LastActive on User", error);
            reject( new Error( error ) );
            return;
        }
    });
}
/**===========================================================
 * ?  setLastActiveAsNow function stamps the
 * *   the given user with Current Time on the
 * *   field lastActive. As a Promise to do
 * *   work asynchronously!
 *============================================================**/
function getUser(idUser:string):Promise<IUserModel>{
    return new Promise((resolve,reject )=>{
        try {
            var query = { "_id": idUser };
            User.findOne(query).select('name email picture').lean().then((res)=>{
                if(res==null){
                    reject( new Error( "No User Found func[getUser(isUser)] with this id: " + idUser ) );
                    return;
                }else{
                    res._id = res._id.toString();
                resolve( res );
                return;
                }
            });
        } catch (error) {
            ////console.debug("Some error while setting LastActive on User", error);
            reject( new Error( error ) );
            return;
        }
    });
}
/// Finished: SAVE THE MESSAGE IN PRIVATE CHAT
/**====================================================================================================================
 * ?  This function will save the message in privateChat referencing both recipient and Sender
 * *    1. If the Chat doesn't exist but user does. Add the reference of the chat to user.
 * *    2. If none of the users had the chat and its a first message than create this chat 
 * *       and reference for both of them
 * *    3. If the Chat exists and users exist which are references than just add the message!
 * *   Uses promise to do work asynchronously!
 *====================================================================================================================**/
function saveMessage(payload:IMessage){
    return new Promise((resolve,reject )=>{
        try {
            //Step 0. Check if recipientExists
            var query = { "_id": payload.recipientId };
            User.findOne(query).exec().then((resUser)=>{
                if ( resUser == null )
                {
                    ////console.debug( "Recipient doesn't exist" );
                    reject( new Error( "Recipient doesn't exist" ) );
                    return;
                }else{
                    //Recipient Exist
                    //Step 1. Convert Payload to Message 
                    let message = new Message({
                        senderId: payload.senderId,
                        recipientId: payload.recipientId,
                        text: payload.text,
                        image: payload.image,
                        createdAt: payload.createdAt,
                    });
                    //Step 2. Save the Message
                    message.save().then( (resultMessage) =>
                    {
                        //console.debug( "chatHelper****************" );
                        //console.debug( resultMessage );
                        //Step 3. Check if Private Chat Exists between this two users
                        const filter = {
                            users: { $all: [payload.senderId, payload.recipientId] }
                        };
                        //const filter = { "users": [payload.senderId, payload.recipientId] };
                        PrivateChat.findOne(filter).lean().exec().then((privateChatResult) => {
                            if ( !privateChatResult )
                            {   
                                //If it doesn't exist -->Create a new Private Chat
                                let privateChat = new PrivateChat( {
                                    "users": [payload.senderId, payload.recipientId],
                                    "messages":[resultMessage._id]
                                } );
                                //Save the privatechat 
                                privateChat.save().then(function(resultPrivateChat)
                                {
                                    //console.debug( "Chat doesn't exists,created: ", resultPrivateChat );
                                   // and add the reference to both sender and recipient
                                    const queryUpdate = { _id: { "$in": [payload.senderId, payload.recipientId] } };
                                    User.updateMany( queryUpdate, { "$push": { privatechats: resultPrivateChat._id } } ).lean().then( (updateRes)=> {
                                        //console.debug( "Chat added to user:  ", updateRes );
                                        resolve( true );
                                        return;
                                    } ).catch( ( err ) =>
                                    {
                                        reject( err );
                                        return;
                                    });  
                                } ).catch( ( err ) =>
                                {
                                    reject( err );
                                    return;
                                });  ;
                                
                            } else{
                                //Private Chat found --> thus it exists
                                //console.debug( "Private chat already exists: ", privateChatResult );
                                //just add the reference "_id" of the message to Private Chat
                                const queryUpdate = { _id: privateChatResult._id};
                                PrivateChat.updateOne( queryUpdate, { $push: { messages: resultMessage._id } } ).lean().then( (updateRes)=> {
                                    //console.debug( "Message appended to user:  ", updateRes );
                                    resolve( true );
                                    return;
                                });
                            }
                        }).catch( ( err ) =>
                        {
                            reject( err );return;
                        });
                    } ).catch( ( reason ) =>
                    {
                        //console.debug( "saveMessageChatHelper: ", reason );
                        reject( new Error( "saveMessageChatHelper: " + reason ) );
                        return;
                    } );
                }

            } ).catch( function (err){
            
                reject( new Error( "Cannot Find recipient,due to\n " + err ) );
                return;
            })
        } catch (error) {
            //console.debug("Some error while setting LastActive on User", error);
            reject( new Error( error ) );
            return;
        }
    });
}
/**====================================================================================================================
 * ?  This function will return the message references in the Private Chat for this User
 * *    1. If the Chat doesn't exist but user does. Add the reference of the chat to user.
 * *    2. If none of the users had the chat and its a first message than create this chat 
 * *       and reference for both of them
 * *    3. If the Chat exists and users exist which are references than just add the message!
 * *   Uses promise to do work asynchronously!
 *====================================================================================================================**/
function getChatHistory(userId:String): Promise<any>{
    return new Promise((resolve,reject )=>{
        try {
            //Step 0. Check if recipientExists
            var query = { "_id": userId };
            User.findOne(query).select('privatechats').populate({
                path: 'privatechats', 
                model: 'PrivateChat',
                populate: [{
                    path: 'messages',
                    model: 'Message'
                },
                {
                    path: 'users',
                    model: 'User',
                    select: 'picture name email _id lastActiveAt'
                }]
            }).lean().then( ( resUser ) =>
            {
                if ( resUser == null )
                {   
                    //console.debug( "Private Chat history doesn't exist" );
                    reject( new Error( "Private Chat History doesn't exist" ) );
                    return;
                }
                else
                {   
                    //console.debug( typeof ( resUser ) );
                    // Return the private Chats List with user and messages populated
                    //console.debug( resUser.privateChats );
                    resolve( resUser.privatechats );
                    return;
                }

            })
        } catch (error) {
            //console.debug("Some error while setting LastActive on User", error);
            reject( new Error( error ) );
            return;
        }
    });
}
/**====================================================================================================================
 * ?  This function will return the mates, this user has opened chat with before
 * *    1. If the user has no mates, returns empty list.
 * *    2. If the user has mates, returns list with users ids
 *====================================================================================================================**/
function getMates(userId:String): Promise<Array<String>>{
    return new Promise((resolve,reject )=>{
        try {
            //Step 0. Check if recipientExists
            const query = {
                users: { $in: [userId] }
            };
            PrivateChat.find(query).select('users').lean().then( ( privateChats:Array<IPrivateChat> ) =>
            {   //console.debug(resPrivChat);
                if ( privateChats == null )
                {   
                    //console.debug( "Private Chat history doesn't exist" );
                    reject( new Error( "Private Chat History doesn't exist, No mates" ) );
                    return;
                }
                else
                {   
                    //List of PrivateChats --> Just to List of User Ids where it is different than myself!
                    let myMates: String[] = [];
                    privateChats.forEach( element =>
                    {
                        myMates.push( element.users[0].equals(userId) ? element.users[1].toString(): element.users[0].toString());
                    } );
                    console.debug(myMates);
                    resolve(myMates );
                    return;
                }

            })
        } catch (error) {
            //console.debug("Some error while setting LastActive on User", error);
            reject( new Error( error ) );
            return;
        }
    });
}
export default {
    setLastActiveAsNow,
    saveMessage,
    getChatHistory,
    getMates,
    getUser
}