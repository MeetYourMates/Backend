import mongoose, { Schema, Document} from 'mongoose';
import Chat, { IChat } from './chat';
import Task, { ITask } from './task';
import Meeting, { IMeeting } from './meeting';
//Modelo de objeto que se guarda en la BBDD de MongoDB
const teamSchema = new Schema({
    name: {
        type: String
    },
    availability: {
        type: Number
    },
    chats: {
        type: Schema.Types.ObjectId,
        ref: Chat
    },
    tasks: {
        type: Schema.Types.ObjectId,
        ref: Task
    },
    meetings: {
        type: Schema.Types.ObjectId,
        ref: Meeting
    }
});

//Interfaz para tratar respuesta como documento
export interface ITeam extends Document {
    name: String;
    availability: Number;
    chat: IChat['_id'];
    tasks: ITask['_id'];
    meetings: IMeeting['_id'];
}

//Exportamos modelo para poder usarlo 
//Mongoose#model(name, [schema], [collectionName], [skipInit])
export default mongoose.model<ITeam>('Team', teamSchema,'teams');