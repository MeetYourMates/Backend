import mongoose, { Schema, Document} from 'mongoose';
import Degree,{ IDegree } from './degree';

//Modelo de objeto que se guarda en la BBDD de MongoDB
const facultySchema = new Schema({
    name: {
        type: String,
        index: true
    },
    degrees: [{
        type: Schema.Types.ObjectId,
        ref: Degree
    }]
});

//Interfaz para tratar respuesta como documento
export interface IFaculty extends Document {
    name: string;
    degrees: IDegree['_id'];
}

//Exportamos modelo para poder usarlo
export default mongoose.model<IFaculty>('Faculty', facultySchema,'faculties');