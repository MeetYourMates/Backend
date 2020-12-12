import {Request, Response} from 'express';
import Student from '../models/student';



const getStudents = async (req: Request, res: Response) => {
    try{
        const results = await Student.find({}).populate('users','trophies','insignias');
        //TODO: Security Risk!!! SENDING PASSWORD OF STUDENTS INSIDE USERS DB
        return res.status(200).json(results);
    } catch (err) {
        return res.status(404).json(err);
    }
}
const getStudent = async (req: Request, res: Response) => {
    try{
        const results = await Student.find({"user": {"email":req.body.email}}).populate('users');
        return res.status(200).json(results);
    } catch (err) {
        return res.status(404).json(err);
    }
}
const getSubjects = async (req: Request, res: Response) => {
    try{
        const results = await Student.find({"user":{"email":req.body.email}}).populate('subjects');
        return res.status(200).json(results);
    } catch (err) {
        return res.status(404).json(err);
    }
}
const addStudent = async (req: Request, res: Response) => {
    const student = new Student({
        "name": req.body.name,
        "university": req.body.university,
        "degree": req.body.degree,
        "user": req.body.user,
        "picture": req.body.picture,
        "rating": req.body.punctuation,
        "trophies": req.body.trophies,
        "insignias": req.body.insignias,
        "courses": req.body.courses,
        "chats": req.body.chats
    });
    student.save().then((data) => {
        return res.status(201).json(data);
    }).catch((err) => {
        return res.status(500).json(err);
    })
}
/******************************POL***************************************/
function updateStudentProfile (req: Request, res: Response){
    console.log(req.body);
    const id: string = req.body._id;
    const name: string = req.body.name;
    const user: string = req.body.user;
    const picture: string = req.body.picture;
    Student.update({"_id": id}, {$set: {"name": name,"user": user, 
                              "picture": picture, }}).then((data) => {
        res.status(201).json(data);
    }).catch((err) => {
        res.status(500).json(err);
    })
}




/***************************************************************************/
function deleteStudent (req:Request,res:Response){
    Student.deleteOne({"_id":req.params._id}).then((data) => {
        res.status(200).json(data);
    }).catch((err) => {
        res.status(500).json(err);
    })
}



export default {getStudents, getStudent,addStudent,getSubjects,updateStudentProfile};
