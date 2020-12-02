import {Request, Response} from 'express';
import Course from '../models/course';
import Student from '../models/student';

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

const addStudent = async(req: Request, res: Response) =>{

    //Display request
    console.log(req.body);

    //Set variables for the data found in the request body
    let subjectId = req.body.subjectId; 
    let studentId = req.body.studentId; 

    //Add student to subject
    let course= await Course.findOne({subject: [subjectId]}).sort({start: -1});
    console.log(course);
    let course1= await Course.find({subject: [subjectId]});
    console.log(course1);
    await Course.updateOne({_id:course?._id}, {$addToSet: {students: studentId}}).then(result => { 
        if (result.nModified == 1) { 
            console.log("Student added successfully"); 
            res.status(201).send({message: 'Student added successfully'}); 
        } else { 
            res.status(409).json('Student was already added!') 
    } }).catch((err) => { 
        console.log("error ", err); 
        res.status(500).json(err); 
    }); 
}

const getCourseStudents = async (req: Request, res: Response) => { //
    let course = req.params.course
    console.log(course);
    try{
        //const results = await Course.find({_id:course}).populate("students");
        const results = await Student.find({courses:course});
        return res.status(200).json(results);
    } catch (err) {
        console.log(err);
        return res.status(404).json(err);
    }
}

export default {getCourse,addCourse,addStudent,getCourseStudents};