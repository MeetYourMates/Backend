import mongoose, { Document, Schema } from 'mongoose';
import Message, { IMessage } from './message';
import User, { IUser } from './user';
//Modelo de objeto que se guarda en la BBDD de MongoDB
const privatechatSchema = new Schema({
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
export interface IPrivateChat extends Document {
    users: IUser['_id'];
    messages: IMessage['_id'];
}

//Exportamos modelo para poder usarlo 
//Mongoose#model(name, [schema], [collectionName], [skipInit])
export default mongoose.model<IPrivateChat>('PrivateChat', privatechatSchema,'privatechats');
