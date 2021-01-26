import mongoose, { Schema, Document} from 'mongoose';
import {ICourse} from "./course";
import Student, {IStudent} from "./student";
import Team, {ITeam} from "./team";
import GroupChat from "./groupchat";
import Task from "./task";
import Meeting from "./meeting";
import {IFaculty} from "./faculty";


const invitationSchema = new Schema({
    sender: {
        type: Schema.Types.ObjectId,
        ref: Student
    },
    receiver: {
        type: Schema.Types.ObjectId,
        ref: Student
    },
    team: {
        type: Schema.Types.ObjectId,
        ref: Team
    },
});


export interface IInvitation extends Document {
    sender: IStudent["_id"];
    receiver: IStudent['_id'];
    team: ITeam['_id'];
}

export default mongoose.model<IInvitation>('Invitation', invitationSchema,'invitations');


