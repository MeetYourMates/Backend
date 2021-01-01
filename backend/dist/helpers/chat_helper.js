"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var message_1 = __importDefault(require("../models/message"));
var privateChat_1 = __importDefault(require("../models/privateChat"));
var user_1 = __importDefault(require("../models/user"));
/// Finished: setLastActiveAsNow on a User
/**===========================================================
 * ?  setLastActiveAsNow function stamps the
 * *   the given user with Current Time on the
 * *   field lastActive. As a Promise to do
 * *   work asynchronously!
 *============================================================**/
function setLastActiveAsNow(idUser) {
    return new Promise(function (resolve, reject) {
        try {
            var query = { "_id": idUser };
            user_1.default.updateOne(query, { lastActiveAt: Date.now() }).then(function (res) {
                if (res.nModified == 0) {
                    reject(new Error("No User Found to add the TimeStamp of lastActive with this id: " + idUser));
                    return;
                }
                resolve(true);
                return;
            });
        }
        catch (error) {
            ////console.debug("Some error while setting LastActive on User", error);
            reject(new Error(error));
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
function saveMessage(payload) {
    return new Promise(function (resolve, reject) {
        try {
            //Step 0. Check if recipientExists
            var query = { "_id": payload.recipientId };
            user_1.default.findOne(query).exec().then(function (resUser) {
                if (resUser == null) {
                    ////console.debug( "Recipient doesn't exist" );
                    reject(new Error("Recipient doesn't exist"));
                    return;
                }
                else {
                    //Recipient Exist
                    //Step 1. Convert Payload to Message 
                    var message = new message_1.default({
                        senderId: payload.senderId,
                        recipientId: payload.recipientId,
                        text: payload.text,
                        image: payload.image,
                        createdAt: payload.createdAt,
                    });
                    //Step 2. Save the Message
                    message.save().then(function (resultMessage) {
                        //console.debug( "chatHelper****************" );
                        //console.debug( resultMessage );
                        //Step 3. Check if Private Chat Exists between this two users
                        var filter = {
                            users: { $all: [payload.senderId, payload.recipientId] }
                        };
                        //const filter = { "users": [payload.senderId, payload.recipientId] };
                        privateChat_1.default.findOne(filter).lean().exec().then(function (privateChatResult) {
                            if (!privateChatResult) {
                                //If it doesn't exist -->Create a new Private Chat
                                var privatechat = new privateChat_1.default({
                                    "users": [payload.senderId, payload.recipientId],
                                    "messages": [resultMessage._id]
                                });
                                //Save the privatechat 
                                privatechat.save().then(function (resultPrivateChat) {
                                    //console.debug( "Chat doesn't exists,created: ", resultPrivateChat );
                                    // and add the reference to both sender and recipient
                                    var queryUpdate = { _id: { "$in": [payload.senderId, payload.recipientId] } };
                                    user_1.default.updateMany(queryUpdate, { "$push": { privatechats: resultPrivateChat._id } }).lean().then(function (updateRes) {
                                        //console.debug( "Chat added to user:  ", updateRes );
                                        resolve(true);
                                        return;
                                    }).catch(function (err) {
                                        reject(err);
                                        return;
                                    });
                                }).catch(function (err) {
                                    reject(err);
                                    return;
                                });
                                ;
                            }
                            else {
                                //Private Chat found --> thus it exists
                                //console.debug( "Private chat already exists: ", privateChatResult );
                                //just add the reference "_id" of the message to Private Chat
                                var queryUpdate = { _id: privateChatResult._id };
                                privateChat_1.default.updateOne(queryUpdate, { $push: { messages: resultMessage._id } }).lean().then(function (updateRes) {
                                    //console.debug( "Message appended to user:  ", updateRes );
                                    resolve(true);
                                    return;
                                });
                            }
                        }).catch(function (err) {
                            reject(err);
                            return;
                        });
                    }).catch(function (reason) {
                        //console.debug( "saveMessageChatHelper: ", reason );
                        reject(new Error("saveMessageChatHelper: " + reason));
                        return;
                    });
                }
            }).catch(function (err) {
                reject(new Error("Cannot Find recipient,due to\n " + err));
                return;
            });
        }
        catch (error) {
            //console.debug("Some error while setting LastActive on User", error);
            reject(new Error(error));
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
function getChatHistory(userId) {
    return new Promise(function (resolve, reject) {
        try {
            //Step 0. Check if recipientExists
            var query = { "_id": userId };
            user_1.default.findOne(query).select('privatechats').populate({
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
            }).lean().then(function (resUser) {
                if (resUser == null) {
                    //console.debug( "Private Chat history doesn't exist" );
                    reject(new Error("Private Chat History doesn't exist"));
                    return;
                }
                else {
                    //console.debug( typeof ( resUser ) );
                    // Return the private Chats List with user and messages populated
                    //console.debug( resUser.privatechats );
                    resolve(resUser.privatechats);
                    return;
                }
            });
        }
        catch (error) {
            //console.debug("Some error while setting LastActive on User", error);
            reject(new Error(error));
            return;
        }
    });
}
/**====================================================================================================================
 * ?  This function will return the mates, this user has opened chat with before
 * *    1. If the user has no mates, returns empty list.
 * *    2. If the user has mates, returns list with users ids
 *====================================================================================================================**/
function getMates(userId) {
    return new Promise(function (resolve, reject) {
        try {
            //Step 0. Check if recipientExists
            var query = {
                users: { $in: [userId] }
            };
            privateChat_1.default.find(query).select('users').lean().then(function (resPrivChat) {
                if (resPrivChat == null) {
                    //console.debug( "Private Chat history doesn't exist" );
                    reject(new Error("Private Chat History doesn't exist, No mates"));
                    return;
                }
                else {
                    //List of PrivateChats --> Just to List of User Ids where it is different than myself!
                    var myMates_1 = [];
                    resPrivChat.forEach(function (element) {
                        myMates_1.push(element.users[0].equals(userId) ? element.users[1] : element.users[0]);
                    });
                    console.debug(myMates_1);
                    resolve(myMates_1);
                    return;
                }
            });
        }
        catch (error) {
            //console.debug("Some error while setting LastActive on User", error);
            reject(new Error(error));
            return;
        }
    });
}
exports.default = {
    setLastActiveAsNow: setLastActiveAsNow,
    saveMessage: saveMessage,
    getChatHistory: getChatHistory,
    getMates: getMates
};
//# sourceMappingURL=chat_helper.js.map