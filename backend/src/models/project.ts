import mongoose, { Schema, Document} from 'mongoose';
import Team, { ITeam } from './team';

//Modelo de objeto que se guarda en la BBDD de MongoDB
const projectSchema = new Schema({
    name: {
        type: String,
        index: true
    },
    hashtags: {
        type: String
    },
    teams: [{
        type: Schema.Types.ObjectId,
        ref: Team
    }],
});

//Interfaz para tratar respuesta como documento
export interface IProject extends Document {
    name: string;
    hashtags: string;
    teams: ITeam['_id']; //Relacion con la coleccion students
}

//Exportamos modelo para poder usarlo
export default mongoose.model<IProject>('Project', projectSchema,'projects');