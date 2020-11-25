import mongoose, { Schema, Document} from 'mongoose';
import Faculty,{ IFaculty } from './faculty';
//Modelo de objeto que se guarda en la BBDD de MongoDB
const universitySchema = new Schema({
    name:{
        type: String
    },
    faculties: [{
        type: Schema.Types.ObjectId,
        ref: Faculty
    }]
});

//Interfaz para tratar respuesta como documento
export interface IUniversity extends Document {
    name: string;
    faculties: IFaculty['_id'];
}
//Remember to Take a look here, to understand how to find().populate
//https://stackoverflow.com/questions/19222520/populate-nested-array-in-mongoose
//Exportamos modelo para poder usarlo 
//Mongoose#model(name, [schema], [collectionName], [skipInit])
export default mongoose.model<IUniversity>('University', universitySchema,'universities');
