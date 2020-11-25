import mongoose, { Schema, Document} from 'mongoose';
//Modelo de objeto que se guarda en la BBDD de MongoDB
const teamSchema = new Schema({
    name: {
        type: String
    },
    availability: {
        type: Number
    },

});

//Interfaz para tratar respuesta como documento
export interface ITeam extends Document {
    name: String;
    availability: Number;
}

//Exportamos modelo para poder usarlo 
//Mongoose#model(name, [schema], [collectionName], [skipInit])
export default mongoose.model<ITeam>('Team', teamSchema,'teams');