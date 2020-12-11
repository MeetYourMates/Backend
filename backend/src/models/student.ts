import mongoose, { Schema, Document} from 'mongoose';
import User, { IUser } from './user';
import Trophy, {ITrophy} from './trophy';
import Insignia, {IInsignia} from './insignia';
import Chat, {IChat} from './chat';
import Rating, { IRating } from './rating';
import  {ICourse} from './course';
const Course = require('./course');

//WINS
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
    //teams
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
    picture: string;
    rating: number;
    ratings: IRating['_id'];
    trophies: ITrophy['_id'];
    insignias: IInsignia['_id'];
    chats: IChat['_id'];
    courses: ICourse['_id'];
}

//Exportamos modelo para poder usarlo
export default mongoose.model<IStudent>('Student', studentSchema,'students');