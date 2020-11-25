import mongoose, { Schema, Document} from 'mongoose';
import User, { IUser } from './user';
import Trophy, {ITrophy} from './trophy';
import Insignia, {IInsignia} from './insignia';
import Course, { ICourse } from './course';
import Chat, {IChat} from './chat';


//Modelo de objeto que se guarda en la BBDD de MongoDB
const studentSchema = new Schema({
    name: {
        type: String,
        index: true
    },
    university: {
        type: String,
    },
    degree: {
        type: String,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: User
    },
    picture: {
        type: String
    },
    punctuation: {
        type: Number
    },
    trophies: [{
        type: Schema.Types.ObjectId,
        ref: Trophy
    }],
    insignias: [{
        type: Schema.Types.ObjectId,
        ref: Insignia
    }],
    courses: {
        type: Schema.Types.ObjectId,
        ref: Course
    },
    chats: {
        type: Schema.Types.ObjectId,
        ref: Chat
    }
});

//Interfaz para tratar respuesta como documento
export interface IStudent extends Document {
    name: string;
    university: string;
    degree: string;
    user: IUser['_id']; //Relacion con la coleccion students
    picture: string;
    punctuation: number;
    trophies: ITrophy['_id'];
    insignias: IInsignia['_id'];
    courses: ICourse['_id'];
    chats: IChat['_id'];
}

//Exportamos modelo para poder usarlo
export default mongoose.model<IStudent>('Student', studentSchema,'students');