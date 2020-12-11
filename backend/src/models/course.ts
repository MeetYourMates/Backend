import mongoose, { Schema, Document} from 'mongoose';
import {IProfessor} from './professor';
const Professor = require('./professor');
import Project, {IProject} from './project';
import  {IStudent} from './student';
const Student = require('./student');
import  {ISubject} from './subject';
const Subject = require('./subject');
//Modelo de objeto que se guarda en la BBDD de MongoDB
const courseSchema = new Schema({
    
    subject: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: Subject
    }],
    start: {
        type: Date,
        index:true
    },
    end: {
        type: Date,
        index:true
    },
    projects: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: Project
    }]
});
//
//Interfaz para tratar respuesta como documento
export interface ICourse extends Document {
    subject: ISubject['_id'];
    start: Date;
    end: Date;
    projects: IProject['_id']
}

//Exportamos modelo para poder usarlo 
//Mongoose#model(name, [schema], [collectionName], [skipInit])
export default mongoose.model<ICourse>('Course', courseSchema,'courses');