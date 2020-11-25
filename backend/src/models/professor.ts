import mongoose, { Schema, Document} from 'mongoose';
import User, { IUser } from './user';

//Modelo de objeto que se guarda en la BBDD de MongoDB
const professorSchema = new Schema({
    name: {
        type: String,
        index: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: User
    },
    picture: {
        type: String
    },
    validated: {
        type: Boolean
    }
});

//Interfaz para tratar respuesta como documento
export interface IProfessor extends Document {
    name: string;
    user: IUser['_id']; //Relacion con la coleccion students
    picture: string;
    validated: boolean;
}

//Exportamos modelo para poder usarlo
export default mongoose.model<IProfessor>('Professor', professorSchema,'professors');