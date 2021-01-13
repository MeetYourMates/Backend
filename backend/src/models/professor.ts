import mongoose, { Document, Schema } from 'mongoose';
import { ICourse } from './course';
import User, { IUser } from './user';
const Course = require('./course');

//Modelo de objeto que se guarda en la BBDD de MongoDB
const professorSchema = new Schema({
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
    courses:[{
        type: Schema.Types.ObjectId,
        ref: Course
    }]
});

//Interfaz para tratar respuesta como documento
export interface IProfessor extends Document {
    name: string;
    user: IUser['_id']; //Relacion con la coleccion students
    picture: string;
    courses: ICourse['_id'];
}

//Exportamos modelo para poder usarlo
export default mongoose.model<IProfessor>('Professor', professorSchema,'professors');