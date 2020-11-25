import mongoose, { Schema, Document} from 'mongoose';
//Modelo de objeto que se guarda en la BBDD de MongoDB
const taskSchema = new Schema({
    name: {
        type: String
    },
    description: {
        type: String
    },
    deadline: {
        type: Date
    },
    assignee: [{
        type: String
    }],
    completed: {
        type: Boolean
    },
    hashtag: {
        type: String
    }
});

//Interfaz para tratar respuesta como documento
export interface ITask extends Document {
    name: string;
    description: string;
    deadline: Date;
    assignee: string;
    completed: boolean;
    hashtag: string;
}

//Exportamos modelo para poder usarlo 
//Mongoose#model(name, [schema], [collectionName], [skipInit])
export default mongoose.model<ITask>('Task', taskSchema,'tasks');