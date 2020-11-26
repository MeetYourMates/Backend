import mongoose, { Schema, Document} from 'mongoose';
import Professor, {IProfessor} from './professor';
import Project, {IProject} from './project';

//Modelo de objeto que se guarda en la BBDD de MongoDB
const subjectSchema = new Schema({
    name: {
        type: String,
        index: true
    },
    projects: [{
        type: Schema.Types.ObjectId,
        ref: Project
    }],
    professors: [{
        type: Schema.Types.ObjectId,
        ref: Professor
    }]


});

//Interfaz para tratar respuesta como documento
export interface ISubject extends Document {
    name: string;
    projects: IProject['_id'];
    professors: IProfessor['_id'];
}

//Exportamos modelo para poder usarlo
export default mongoose.model<ISubject>('Subject', subjectSchema,'subject');