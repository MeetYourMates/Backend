import mongoose, { Schema, Document} from 'mongoose';

const recoverySchema = new Schema({
    email: {
        type: String
    },
    code: {
        type: String
    }
})

export interface IRecovery extends Document {
    email:string;
    code: string;
}

export default mongoose.model<IRecovery>('Recovery', recoverySchema,'recoveries');
