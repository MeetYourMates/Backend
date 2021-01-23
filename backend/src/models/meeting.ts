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
        type: Number
    },
    location: {
        type: [{
            type: Number
        }],
        validate: [arrayLimit, 'Location should only contain [Longitude,Latitude] format!']
    }
});
function arrayLimit(val) {

    return val.length == 2 || val.length == 0 || false;
}
//Interfaz para tratar respuesta como documento
export interface IMeeting extends Document {
    name: string;
    description: string;
    date: Number;
    location: [Number];
}

//Exportamos modelo para poder usarlo
//Mongoose#model(name, [schema], [collectionName], [skipInit])
export default mongoose.model<IMeeting>('Meeting', meetingSchema,'meetings');
