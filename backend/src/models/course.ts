import mongoose, { Schema, Document} from 'mongoose';
import Subject, {ISubject} from './subject';

//Modelo de objeto que se guarda en la BBDD de MongoDB
const courseSchema = new Schema({
    year: {
        type: Number,
        index:true
    },
    subjects: [{
        type: Schema.Types.ObjectId,
        ref: Subject
    }]


});

//Interfaz para tratar respuesta como documento
export interface ICourse extends Document {
    name: string;
    subjects: ISubject['_id'];
}

//Exportamos modelo para poder usarlo
export default mongoose.model<ICourse>('Course', courseSchema,'courses');