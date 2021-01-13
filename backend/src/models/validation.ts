import mongoose, { Schema, Document} from 'mongoose';
import User, {IUser} from "./user";

const validationSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: User
    },
    code: {
        type: String
    },
    name: {
        type: String
    },
    surname: {
        type: String
    }
})

export interface IValidation extends Document {
    user: IUser['_id'];
    code: string;
    name: string;
    surname: string;
}

export default mongoose.model<IValidation>('Validation', validationSchema,'validations');
