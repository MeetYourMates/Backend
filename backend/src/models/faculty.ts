import mongoose, { Schema, Document} from 'mongoose';
import Degree,{ IDegree } from './degree';

//Modelo de objeto que se guarda en la BBDD de MongoDB
const facultySchema = new Schema({
    name: {
        type: String,
        index: true
    },
    degrees: {
        type: Schema.Types.ObjectId,
        ref: Degree
    }
});

//Interfaz para tratar respuesta como documento
export interface IFaculty extends Document {
    name: string;
    degrees: IDegree['_id'];
}

/*"_id": {
    "$oid": "6a73646a7765727472323331"
},
"password": "123",
"email": "123@123.com"
}*/

//Exportamos modelo para poder usarlo
export default mongoose.model<IFaculty>('Faculty', facultySchema,'faculties');