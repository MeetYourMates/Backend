import mongoose, { Schema, Document} from 'mongoose';
//Modelo de objeto que se guarda en la BBDD de MongoDB
const ratingSchema = new Schema({
    stars:{
        type: Number
    },
    ratedBy: {
        type: String
    },
    date: {
        type: Date
    }
});

//Interfaz para tratar respuesta como documento
export interface IRating extends Document {
    stars: number;
    ratedBy: string;
    date: Date;
}

//Exportamos modelo para poder usarlo 
//Mongoose#model(name, [schema], [collectionName], [skipInit])
export default mongoose.model<IRating>('Rating', ratingSchema,'ratings');
