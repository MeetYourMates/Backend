import mongoose, { Document, Schema } from 'mongoose';
//Modelo de objeto que se guarda en la BBDD de MongoDB
const messageSchema = new Schema({
    senderId: {
        type: String
    },
    recipientId: {
        type: String
    },
    text: {
        type: String
    },
    image: {
        type: String
    },
    createdAt:{
        type:Date
    }
});

//Interfaz para tratar respuesta como documento
export interface IMessage extends Document {
    senderId: string;
    recipientId: string;
    text: string;
    image: string;
    createdAt: Date;
}

//Exportamos modelo para poder usarlo 
//Mongoose#model(name, [schema], [collectionName], [skipInit])
export default mongoose.model<IMessage>('Message', messageSchema,'messages');