import  {model, Schema, Document} from "mongoose";

export interface IStudent extends Document {
    name: string;
    password: string;
    university: string;
    degree: string;
    email: string;
    picture: string;
    validated: boolean;
} //FALTAN LAS RELACIONES

const studentSchema = new Schema({
    name: {type: String},
    password: {type: String},
    university: {type: String},
    degree: {type: String},
    email: {type: String},
    picture: {type: String},
    validated: {type: Boolean}
})

export default model<IStudent>("Student", studentSchema, "students");
