import mongoose, { Schema, Document} from 'mongoose';
//Modelo de objeto que se guarda en la BBDD de MongoDB
const trophySchema = new Schema({
    id: {
        type: String
    },
    difficulty: {
        type: String
    },
    logo: {
        type: String
    }
});

//Interfaz para tratar respuesta como documento
export interface ITrophy extends Document {
    id: string;
    difficulty: string;
    logo: string;
}

//Exportamos modelo para poder usarlo 
//Mongoose#model(name, [schema], [collectionName], [skipInit])
export default mongoose.model<ITrophy>('Trophy', trophySchema,'trophies');
