import mongoose, { Schema, Document} from 'mongoose';
import Student, { IStudent } from './student';
import user, { IUser } from './user';
//Modelo de objeto que se guarda en la BBDD de MongoDB
const ratingSchema = new Schema({
    stars:{
        type: Number
    },
    ratedBy: {
        type: Schema.Types.ObjectId,
        ref: user
    },
    date: {
        type: Date
    }
});

//Interfaz para tratar respuesta como documento
export interface IRating extends Document {
    stars: number;
    ratedBy: IUser['_id'];
    date: Date;
}

//Exportamos modelo para poder usarlo 
//Mongoose#model(name, [schema], [collectionName], [skipInit])
export default mongoose.model<IRating>('Rating', ratingSchema,'ratings');
