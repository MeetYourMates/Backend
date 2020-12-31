import Message, { IMessage } from "../models/message";
import PrivateChat from "../models/privateChat";
import User from "../models/user";

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
                    reject(new Error("No User Found to add the TimeStamp of lastActive with this id: "+idUser));   
                }
                resolve(true);
            });
        } catch (error) {
            //console.debug("Some error while setting LastActive on User", error);
            reject(new Error(error));
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
function saveMessage(payload:IMessage, isRecipientOnline:boolean){
    return new Promise((resolve,reject )=>{
        try {
            //Step 0. Check if recipientExists
            var query = { "_id": payload.recipientId };
            User.findOne(query).then((resUser)=>{
                if ( resUser == null )
                {
                    console.debug( "Recipient doesn't exist" );
                    reject(new Error("Recipient doesn't exist"));
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
                        console.debug( "chatHelper****************" );
                        //console.debug( resultMessage );
                        //Step 3. Check if Private Chat Exists between this two users
                        const filter = {
                            users: { $all: [payload.senderId, payload.recipientId] }
                        };
                        //const filter = { "users": [payload.senderId, payload.recipientId] };
                        PrivateChat.findOne(filter).lean().then((privateChatResult) => {
                            if ( !privateChatResult )
                            {   
                                //If it doesn't exist -->Create a new Private Chat
                                let privatechat = new PrivateChat( {
                                    "users": [payload.senderId, payload.recipientId],
                                    "messages":[resultMessage._id]
                                } );
                                //Save the privatechat 
                                privatechat.save().then(function(resultPrivateChat)
                                {
                                    console.debug( "Chat doesn't exists,created: ", resultPrivateChat );
                                   // and add the reference to both sender and recipient
                                    const queryUpdate = { _id: { "$in": [payload.senderId, payload.recipientId] } };
                                    User.updateMany( queryUpdate, { "$push": { privatechats: resultPrivateChat._id } } ).lean().then( (updateRes)=> {
                                        console.debug( "Chat added to user:  ", updateRes );
                                        resolve( true );
                                    } ).catch( ( err ) =>
                                    {
                                        reject( err );
                                    });  
                                } ).catch( ( err ) =>
                                {
                                    reject( err );
                                });  ;
                                
                            } else{
                                //Private Chat found --> thus it exists
                                console.debug( "Private chat already exists: ", privateChatResult );
                                //just add the reference "_id" of the message to Private Chat
                                const queryUpdate = { _id: privateChatResult._id};
                                PrivateChat.updateOne( queryUpdate, { $push: { messages: resultMessage._id } } ).lean().then( (updateRes)=> {
                                    console.debug( "Message appended to user:  ", updateRes );
                                    resolve( true );
                                });
                            }
                        }).catch( ( err ) =>
                        {
                            reject( err );
                        });
                    } ).catch( ( reason ) =>
                    {
                        console.debug( "saveMessageChatHelper: ", reason );
                        reject(new Error("saveMessageChatHelper: "+ reason ));
                    } );
                }

            })
        } catch (error) {
            //console.debug("Some error while setting LastActive on User", error);
            reject(new Error(error));
        }
    });
}
/// TODO: GET THE MESSAGE OF A USER PRIVATE CHAT
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
                    console.debug( "Private Chat history doesn't exist" );
                    reject(new Error("Private Chat History doesn't exist"));
                }
                else
                {   
                    console.debug( typeof ( resUser ) );
                    // Return the private Chats List with user and messages populated
                    console.debug( resUser.privatechats );
                    resolve( resUser.privatechats );
                }

            })
        } catch (error) {
            //console.debug("Some error while setting LastActive on User", error);
            reject(new Error(error));
        }
    });
}
export default {
    setLastActiveAsNow,
    saveMessage,
    getChatHistory
}