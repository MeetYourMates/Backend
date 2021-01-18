import mongoose, { Document, Schema } from 'mongoose';
import Course, { ICourse } from './course';
import User, { IUser } from './user';

//Modelo de objeto que se guarda en la BBDD de MongoDB
const professorSchema = new Schema({
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
    courses:[{
        type: Schema.Types.ObjectId,
        ref: Course
    }]
});

//Interfaz para tratar respuesta como documento
export interface IProfessor extends Document {
    university: string;
    degree: string;
    user: IUser['_id']; //Relacion con la coleccion students
    courses: ICourse['_id'];
}

//Exportamos modelo para poder usarlo
export default mongoose.model<IProfessor>('Professor', professorSchema,'professors');