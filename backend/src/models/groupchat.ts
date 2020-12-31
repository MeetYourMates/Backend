import mongoose, { Document, Schema } from 'mongoose';
import Message, { IMessage } from './message';
import User, { IUser } from './user';
//Modelo de objeto que se guarda en la BBDD de MongoDB
const groupchatSchema = new Schema({
    //Name, Description, Picture will only be available for group Chats
    name: {
        type: String
    },
    description: {
        type: String
    },
    picture: {
        type: String
    },
    users:[{
        type: Schema.Types.ObjectId,
        ref:User
    }],
    messages: [{
        type: Schema.Types.ObjectId,
        ref: Message
    }]
});

//Interfaz para tratar respuesta como documento
export interface IGroupChat extends Document {
    name: string;
    isGroupChat: Boolean;
    description: string;
    users: IUser['_id'];
    messages: IMessage['_id'];
    picture: string;
}

//Exportamos modelo para poder usarlo 
//Mongoose#model(name, [schema], [collectionName], [skipInit])
export default mongoose.model<IGroupChat>('GroupChat', groupchatSchema,'groupchats');
