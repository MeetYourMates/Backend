import mongoose, { Schema, Document} from 'mongoose';
import  {ICourse} from './course';
const Course  = require('./course');

//Modelo de objeto que se guarda en la BBDD de MongoDB
const subjectSchema = new Schema({
    name: {
        type: String,
        index:true
    },
    courses: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: Course
    }]
   
});

//Interfaz para tratar respuesta como documento
export interface ISubject extends Document {
    name: string;
    courses: ICourse['_id'];
}

//Exportamos modelo para poder usarlo
export default mongoose.model<ISubject>('Subject', subjectSchema,'subjects');