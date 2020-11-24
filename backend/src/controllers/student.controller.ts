import {Request, Response} from 'express';
import User from '../models/user';
import Student from '../models/student';

const getStudents = async (req: Request, res: Response) => {
    //El await hace que la siguiente linea no se ejecute
    //hasta que el resultado no se haya obtenido
    try{
        const results = await Student.find({}).populate('user');
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
    try{
        const results = await Student.find({"user": {"email":req.body.email,"token":req.body.token}}).populate('users');
        return res.status(200).json(results);
    } catch (err) {
        return res.status(404).json(err);
    }
}
export default {getStudents, getStudent,newStudent};