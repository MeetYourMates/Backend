import { Request, Response } from 'express';
import Student from '../models/student';
import User from '../models/user';



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
const getSubjectsProjects = async (req: Request, res: Response) => {
    try{
        const results = await Student.find({"user":{"email":req.params.email}})
    .populate({
        path: 'courses', 
        model: 'Course',
        populate: [{
            path: 'subjects',
            model: 'Subject'
        }, 
        {
            path: 'projects',
            model: 'Project'
        }]}).exec();

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
    //Only Updates Name and  Picture
    User.findByIdAndUpdate({"_id": req.body.user._id}, {$set: {"name": req.body.user.name,"picture":req.body.user.picture}}).then((data) => {
        if(data==null) return res.status(400).json(req.body);
        Student.findByIdAndUpdate({"_id": req.body._id},{$set: {"ratings": req.body.ratings,"trophies":req.body.trophies,"insignias":req.body.insignias}},{
            new: true
          }).then((resultStudent)=>{
          if(resultStudent==null){return res.status(400).json(req.body);}
          console.log("***************************************");
          console.log(resultStudent);
          res.status(200).json(req.body);
        })
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



export default {getStudents, getStudent,addStudent,getSubjectsProjects,updateStudentProfile};
