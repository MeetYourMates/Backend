import {Request, Response} from 'express';
import Student from '../models/student';

const getStudents = async (req: Request, res: Response) => {
    try{
        const results = await Student.find({}).populate('users','trophies','insignias');
        return res.status(200).json(results);
    } catch (err) {
        return res.status(404).json(err);
    }
}

const getStudent = async (req: Request, res: Response) => {
    try{
        const results = await Student.find({"user": {"email":req.body.email,"token":req.body.token}}).populate('users');
        return res.status(200).json(results);
    } catch (err) {
        return res.status(404).json(err);
    }
}
const newStudent = async (req: Request, res: Response) => {
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

function updateStudent (req: Request, res: Response){
    const id: string = req.body._id;
    const name: string = req.params.name;
    const university: string = req.body.university;
    const degree: string = req.body.degree;
    const user: number = req.body.user;
    const picture: string = req.body.picture;
    const rating: number = req.body.rating;
    const trophies: string = req.body.trophies;
    const courses: string = req.body.courses;
    const chats: string = req.body.chats;
    Student.update({"_id": id}, {$set: {"name": name, "university": university, "degree": degree, "user": user, 
                              "picture": picture, "rating": rating, "trophies": trophies, "courses": courses, "chats": chats}}).then((data) => {
        res.status(201).json(data);
    }).catch((err) => {
        res.status(500).json(err);
    })
}
function deleteStudent (req:Request,res:Response){
    Student.deleteOne({"_id":req.params._id}).then((data) => {
        res.status(200).json(data);
    }).catch((err) => {
        res.status(500).json(err);
    })
}
export default {getStudents, getStudent,newStudent, updateStudent, deleteStudent};