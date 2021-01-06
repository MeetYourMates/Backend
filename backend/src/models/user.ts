import mongoose, { Document, Schema } from 'mongoose';
import GroupChat, { IGroupChat } from './groupchat';
import PrivateChat, { IPrivateChat } from './privateChat';
//Modelo de objeto que se guarda en la BBDD de MongoDB
const userSchema = new Schema({
    name: {
        type: String
    },
    email: {
        type: String
    },
    password: {
        type: String
    },
    validated: {
        type: Boolean
    },
    picture:{
        type:String
    },
    lastActiveAt: {
        type:Date
    },
    privatechats: [{
        type: Schema.Types.ObjectId,
        ref: PrivateChat
    }],
    groupchats: [{
        type: Schema.Types.ObjectId,
        ref: GroupChat
    }]
});

//Interfaz para tratar respuesta como documento
export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    picture: string;
    validated: boolean;
    privatechats: IPrivateChat['_id'];
    groupchats: IGroupChat['_id'];
}
//Interface for User without mongoose document
export interface IUserModel {
    _id:string;
    name: string;
    email: string;
    password: string;
    picture: string;
    validated: boolean;
}

//Exportamos modelo para poder usarlo 
//Mongoose#model(name, [schema], [collectionName], [skipInit])
export default mongoose.model<IUser>('User', userSchema,'users');
