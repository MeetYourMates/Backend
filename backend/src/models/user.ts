import mongoose, { Document, Schema } from 'mongoose';
//Modelo de objeto que se guarda en la BBDD de MongoDB
const userSchema = new Schema({
    name: {
        type: String
    },
    email: {
        type: String
    },
    password: {
        type: String
    },
    validated: {
        type: Boolean
    },
    picture:{
        type:String
    }
});

//Interfaz para tratar respuesta como documento
export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    picture: string;
    validated: boolean;
}

//Exportamos modelo para poder usarlo 
//Mongoose#model(name, [schema], [collectionName], [skipInit])
export default mongoose.model<IUser>('User', userSchema,'users');
