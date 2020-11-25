import mongoose, { Schema, Document} from 'mongoose';
import Professor, {IProfessor} from './professor';
//Modelo de objeto que se guarda en la BBDD de MongoDB
const trophySchema = new Schema({
    id: {
        type: String
    },
    difficulty: {
        type: String
    },
    professor: {
        type: Schema.Types.ObjectId,
        ref: Professor
    },
    date: {
        type: Date
    },
    logo: {
        type: String
    }
});

//Interfaz para tratar respuesta como documento
export interface ITrophy extends Document {
    id: string;
    difficulty: string;
    professor: IProfessor['_id'];
    date: Date;
    logo: string;
}

//Exportamos modelo para poder usarlo 
//Mongoose#model(name, [schema], [collectionName], [skipInit])
export default mongoose.model<ITrophy>('Trophy', trophySchema,'trophies');
