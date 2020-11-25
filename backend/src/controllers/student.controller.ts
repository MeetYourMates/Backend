import {Request, Response} from 'express';
import Student from '../models/student';

const getStudents = async (req: Request, res: Response) => {
    try{
        const results = await Student.find({}).populate('trophies','insignias');
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
        "punctuation": req.body.punctuation,
        "trophies": req.body.trophies,
        "insignias": req.body.insignias
    });
    student.save().then((data) => {
        return res.status(201).json(data);
    }).catch((err) => {
        return res.status(500).json(err);
    })
}
export default {getStudents, getStudent,newStudent};