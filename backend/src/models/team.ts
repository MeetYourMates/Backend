import mongoose, { Schema, Document} from 'mongoose';
import Chat, { IChat } from './chat';
//Modelo de objeto que se guarda en la BBDD de MongoDB
const teamSchema = new Schema({
    name: {
        type: String
    },
    availability: {
        type: Number
    },
    chat: {
        type: Schema.Types.ObjectId,
        ref: Chat
    }
});

//Interfaz para tratar respuesta como documento
export interface ITeam extends Document {
    name: String;
    availability: Number;
    chat: IChat['_id'];
}

//Exportamos modelo para poder usarlo 
//Mongoose#model(name, [schema], [collectionName], [skipInit])
export default mongoose.model<ITeam>('Team', teamSchema,'teams');