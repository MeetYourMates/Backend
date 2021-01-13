import { IStudent } from "../models/student";

//Custom Student with user = {email,password, token}
function getCustomStudent(student: IStudent,user:any) {
    const result = {_id:student._id,name:student.name,university:student.university,degree:student.degree,user:user,
    ratings:student.ratings,trophies:student.trophies,insignias:student.insignias,
    courses:student.courses
    };
    return result;
}

export default {
    getCustomStudent
}