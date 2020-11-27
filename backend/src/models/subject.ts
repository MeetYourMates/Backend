import mongoose, { Schema, Document} from 'mongoose';
import Professor, {IProfessor} from './professor';
import Project, {IProject} from './project';
import  {IStudent} from './student';
const Student = require('./student');
//Modelo de objeto que se guarda en la BBDD de MongoDB
const subjectSchema = new Schema({
    name: {
        type: String,
        index:true
    },
    start: {
        type: Date,
        index:true
    },
    finish: {
        type: Date,
        index:true
    },
    projects: [{
        type: Schema.Types.ObjectId,
        ref: Project
    }],
    professors: [{
        type: Schema.Types.ObjectId,
        ref: Professor
    }],
    students: [{
        type: Schema.Types.ObjectId,
        ref: Student
    }]
});

//Interfaz para tratar respuesta como documento
export interface ISubject extends Document {
    name: string;
    start: Date;
    end: Date;
    projects: IProject['_id'];
    professors: IProfessor['_id'];
    students: IStudent['_id'];
}

//Exportamos modelo para poder usarlo
export default mongoose.model<ISubject>('Subject', subjectSchema,'subject');