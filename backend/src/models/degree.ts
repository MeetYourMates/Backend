import mongoose, { Schema, Document} from 'mongoose';
import  {ISubject} from './subject';
const Subject = require('./subject');

//Modelo de objeto que se guarda en la BBDD de MongoDB
var degreeSchema = new Schema({
    name: {
        type: String,
        index: true
    },
    subjects: {
        type: Schema.Types.ObjectId,
        ref: Subject
    }
});

//Interfaz para tratar respuesta como documento
export interface IDegree extends Document {
    name: string;
    subjects: ISubject['_id'];
}

//Exportamos modelo para poder usarlo
export default mongoose.model<IDegree>('Degree', degreeSchema,'degrees');