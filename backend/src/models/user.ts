import mongoose, { Schema, Document} from 'mongoose';
//Modelo de objeto que se guarda en la BBDD de MongoDB
const userSchema = new Schema({
    email: {
        type: String
    },
    password: {
        type: String
    },
    token: {
        type: String
    }
});

//Interfaz para tratar respuesta como documento
export interface IUser extends Document {
    email: string;
    password: string;
    token:String
}

//Exportamos modelo para poder usarlo 
//Mongoose#model(name, [schema], [collectionName], [skipInit])
export default mongoose.model<IUser>('User', userSchema,'users');