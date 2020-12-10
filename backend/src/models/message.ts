import mongoose, { Schema, Document} from 'mongoose';
//Modelo de objeto que se guarda en la BBDD de MongoDB
const messageSchema = new Schema({
    name: {
        type: String
    },
    text: {
        type: String
    },
    picture: {
        type: String
    }
});

//Interfaz para tratar respuesta como documento
export interface IMessage extends Document {
    name: string;
    text: string;
    picture: string;
}

//Exportamos modelo para poder usarlo 
//Mongoose#model(name, [schema], [collectionName], [skipInit])
export default mongoose.model<IMessage>('Message', messageSchema,'messages');