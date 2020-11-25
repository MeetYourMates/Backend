import mongoose, { Schema, Document} from 'mongoose';
import User, { IUser } from './user';

//Modelo de objeto que se guarda en la BBDD de MongoDB
const studentSchema = new Schema({
    name: {
        type: String,
        index: true
    },
    teamNames: {
        type: Array,
    },
    numberStudents: {
        type: Number,
    },
    hashtags: {
        type: Array,
    }
});

//Interfaz para tratar respuesta como documento
export interface IStudent extends Document {
    name: string;
    university: string;
    degree: string;
    user: IUser['_id']; //Relacion con la coleccion students
    picture: string;
    validated: boolean;
}

//Exportamos modelo para poder usarlo
export default mongoose.model<IStudent>('Student', studentSchema,'students');