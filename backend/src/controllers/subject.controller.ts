import {Request, Response} from 'express';
import Subject from '../models/subject';
import Course from '../models/course';

const addSubject = async (req: Request, res: Response) => {
    const subject = new Subject({
        "name": req.body.name
    });
    subject.save().then((data) => {
        return res.status(201).json(data);
    }).catch((err) => {
        return res.status(500).json(err);
    })
}
const addCourse = async(req: Request, res: Response) =>{

    //Display request
    console.log(req.body);

    //Create a new student entity with the data found in request
    let course = new Course({ 
        "subject":req.body.subject,
        "name": req.body.name,
        "start": new Date(req.body.start),
        "end": new Date(req.body.end)
     }); 

    //Look for the student in the database
    let coursedata =await Course.findOne({subject: course.subject,start:course.start});

    //If the student is not in the database then save it
    if (!coursedata) { 
        await course.save().then((data) => { 
            coursedata = data;
        });
    }
    //Add student to subject
    await Subject.updateOne({"_id": course.subject}, {$addToSet: {courses: coursedata?._id}}).then(result => { 
        if (result.nModified == 1) { 
            console.log("Course added successfully"); 
            res.status(201).send({message: 'Course added successfully'}); 
        } else { 
            res.status(409).json('Course was already added!') 
    } }).catch((err) => { 
        console.log("error ", err); 
        res.status(500).json(err); 
    }); 
 }

export default {addSubject,addCourse};