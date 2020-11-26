import mongoose, { Schema, Document} from 'mongoose';
//Modelo de objeto que se guarda en la BBDD de MongoDB
const insigniaSchema = new Schema({
    hashtag:{
        type: String
    },
    requirement: {
        type: Number
    },
    date: {
        type: Date
    },
    logo: {
        type: String
    }
});

//Interfaz para tratar respuesta como documento
export interface IInsignia extends Document {
    hashtag: string;
    requirement: Number;
    date: string;
    logo: string;
}

//Exportamos modelo para poder usarlo 
//Mongoose#model(name, [schema], [collectionName], [skipInit])
export default mongoose.model<IInsignia>('Insignia', insigniaSchema,'insignias');
