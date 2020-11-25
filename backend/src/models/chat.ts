import mongoose, { Schema, Document} from 'mongoose';
import Message, { IMessage } from './message';
//Modelo de objeto que se guarda en la BBDD de MongoDB
const chatSchema = new Schema({
    name: {
        type: String
    },
    description: {
        type: String
    },
    picture: {
        type: String
    },
    messages: [{
        type: Schema.Types.ObjectId,
        ref: Message
    }]
});

//Interfaz para tratar respuesta como documento
export interface IChat extends Document {
    name: string;
    description: string;
    picture: string;
}

//Exportamos modelo para poder usarlo 
//Mongoose#model(name, [schema], [collectionName], [skipInit])
export default mongoose.model<IChat>('Chat', chatSchema,'chats');
