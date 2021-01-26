import mongoose, { Schema, Document} from 'mongoose';
import Team, { ITeam } from './team';

//Modelo de objeto que se guarda en la BBDD de MongoDB
const projectSchema = new Schema({
    name: {
        type: String,
        index: true
    },
    teamNames: [{
        type: String
    }],
    numberStudents: {
        type: Number
    },
    hashtags: [{
        type: String
    }],
    teams: {
        type: Schema.Types.ObjectId,
        ref: Team
    },
    closed: {
        type: Boolean,
    }
});

//Interfaz para tratar respuesta como documento
export interface IProject extends Document {
    name: string;
    teamNames: string;
    numberStudents: number;
    teams: ITeam['_id']; //Relacion con la coleccion students
    closed: boolean;
}

//Exportamos modelo para poder usarlo
export default mongoose.model<IProject>('Project', projectSchema,'projects');