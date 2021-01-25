import { Request, Response } from 'express';
import customHelper from "../helpers/custom_models_helper";
import jwtHelper from "../helpers/jwt";
import Course from '../models/course';
import Professor from '../models/professor';
import Student from '../models/student';
import Project from '../models/project';
const getCourse = async (req: Request, res: Response) => {
    let course = req.params.subject
    try{
        const results = await Course.find({"_id": course}).populate('students');
        return res.status(200).json(results);
    } catch (err) {
        return res.status(404).json(err);
    }
}

const addCourse = async (req: Request, res: Response) => {
    const course = new Course({
        "name": req.body.name,
        "start": new Date(req.body.start),
        "end": new Date(req.body.end)
    });
    course.save().then((data) => {
        return res.status(201).json(data);
    }).catch((err) => {
        return res.status(500).json(err);
    })
}

//Add a course to a student and vice versa!
const addStudent = async(req: Request, res: Response) =>{

    //Display request
    console.log(req.body);
    if(req.body==null){
        res.status(400).send({message: 'Bad Request'});
    }
    if(req.body.subjectId==null|| req.body.studentId==null){
        res.status(400).send({message: 'Bad Request'});
    }
    //Set variables for the data found in the request body
    let subjectId:string = req.body.subjectId; 
    let studentId:string = req.body.studentId; 

    //Add student to subject
    await Course.findOne({subject: [subjectId]}).sort({start: -1}).then(course => { 
        //No error and we got a result
        console.log("Adding Course to Student: ");
        console.log([course]);
        if(course!=null){
            //We got the course now we search if the student has this course
            //@ts-ignore
            Student.findOneAndUpdate({_id:studentId}, {"$addToSet": {courses: course!._id},"$set": {"university": req.body.university,"degree":req.body.degree}},{returnOriginal:false}).populate('user')
            .exec(function(err, result) {
                console.log("Course Update: ",result);
                if (err) {
                    // ...
                    res.status(400).send({message: 'No Subject in Database'});
                } else {
                    let userWithToken:any = {
                        "_id":result.user._id,
                        "password": "password-hidden",
                        "email": result.user.email,
                        "name": result.user.name,
                        "picture": result.user.picture,
                        "validated": true,
                        "token":jwtHelper.createToken(result.user)
                    };
                    const result2 = customHelper.getCustomStudent(result,userWithToken);
                    console.log("Course: result2: ",result2);
                    res.status(201).send(result2); 
                }
            });
        }
    });
}
const addProfessor = async(req: Request, res: Response) =>{

   //Display request
   console.log(req.body);
   if(req.body==null){
       res.status(400).send({message: 'Bad Request'});
   }
   if(req.body.subjectId==null|| req.body.professorId==null){
       res.status(400).send({message: 'Bad Request'});
   }
   //Set variables for the data found in the request body
   let subjectId:string = req.body.subjectId; 
   let professorId:string = req.body.professorId; 

   //Add student to subject
   await Course.findOne({subject: [subjectId]}).sort({start: -1}).then(course => { 
       //No error and we got a result
       console.log("Adding Course to Professor: ");
       console.log([course]);
       if(course!=null){
           //We got the course now we search if the student has this course
           //@ts-ignore
           Professor.findOneAndUpdate({_id:professorId}, {"$addToSet": {courses: course!._id},"$set": {"university": req.body.university,"degree":req.body.degree}},{returnOriginal:false}).populate('user').lean()
           .exec(function(err, result) {
               console.log("Course Update: ",result);
               if (err) {
                   // ...
                   res.status(400).send({message: 'No Subject in Database'});
               } else {
                   let userWithToken:any = {
                       "_id":result.user._id,
                       "password": "password-hidden",
                       "email": result.user.email,
                       "name": result.user.name,
                       "picture": result.user.picture,
                       "validated": true,
                       "token":jwtHelper.createToken(result.user)
                   };
                   //const result2 = customHelper.getCustomStudent(result,userWithToken);
                   result['user'] = userWithToken;
                   console.log("Course: result2: ",result);
                   res.status(201).send(result); 
               }
           });
       }
   });
}

const getCourseStudents = async (req: Request, res: Response) => { //
    let course = req.params.course
    console.log(course);
    try{
        //const results = await Course.find({_id:course}).populate("students");
        const results = await Student.find({courses:course}).populate('user');
        return res.status(200).json(results);
    } catch (err) {
        console.log(err);
        return res.status(404).json(err);
    }
}

/*************** PEP *************/
//Add a new project to the course
const addProject = async (req: Request, res: Response) => {
    const project = new Project({
        "name": req.body.name,
        "numberStudents": req.body.numberStudents,
    });
    project.save().then((data) => {
        return res.status(201).json(data);
    }).catch((err) => {
        return res.status(500).json(err);
    })
}
/************************************************************************/

export default {getCourse,addCourse,addStudent,getCourseStudents,addProfessor,addProject};