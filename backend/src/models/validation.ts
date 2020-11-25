import mongoose, { Schema, Document} from 'mongoose';
import User, {IUser} from "./user";

const validationSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: User
    },
    code: {
        type: String
    }
})

export interface IValidation extends Document {
    user: IUser['_id'];
    code: string;
}

export default mongoose.model<IValidation>('Validation', validationSchema,'validations');
