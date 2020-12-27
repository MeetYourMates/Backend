import mongoose, { Document, Schema } from 'mongoose';
import Chat, { IChat } from './chat';
import Course, { ICourse } from './course';
import Insignia, { IInsignia } from './insignia';
import Rating, { IRating } from './rating';
import Trophy, { ITrophy } from './trophy';
import User, { IUser } from './user';


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
    ratings: [{
        type: Schema.Types.ObjectId,
        ref: Rating
    }],
    rating:{
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
    chats: [{
        type: Schema.Types.ObjectId,
        ref: Chat
    }],
    courses:[{
        type: Schema.Types.ObjectId,
        ref: Course
    }]
});

//Interfaz para tratar respuesta como documento
export interface IStudent extends Document {
    name: string;
    university: string;
    degree: string;
    user: IUser['_id']; //Relacion con la coleccion students
    rating: number;
    ratings: IRating['_id'];
    trophies: ITrophy['_id'];
    insignias: IInsignia['_id'];
    chats: IChat['_id'];
    courses: ICourse['_id'];
}

//Exportamos modelo para poder usarlo
export default mongoose.model<IStudent>('Student', studentSchema,'students');