import mongoose, { Schema, Document} from 'mongoose';
import User, { IUser } from './user';
import Professor, {IProfessor} from './professor';

//Modelo de objeto que se guarda en la BBDD de MongoDB
const subjectSchema = new Schema({
    name: {
        type: String,
        index: true
    },

});

//Interfaz para tratar respuesta como documento
export interface ISubject extends Document {
    name: string;
}

//Exportamos modelo para poder usarlo
export default mongoose.model<ISubject>('Subject', subjectSchema,'subject');