import mongoose, { Schema, Document} from 'mongoose';
//Modelo de objeto que se guarda en la BBDD de MongoDB
const meetingSchema = new Schema({
    name: {
        type: String
    },
    description: {
        type: String
    },
    date: {
        type: Date
    },
    location: [{
        type: String
    }]
});

//Interfaz para tratar respuesta como documento
export interface IMeeting extends Document {
    name: string;
    description: string;
    date: Date;
    location: string;
}

//Exportamos modelo para poder usarlo
//Mongoose#model(name, [schema], [collectionName], [skipInit])
export default mongoose.model<IMeeting>('Meeting', meetingSchema,'meetings');
