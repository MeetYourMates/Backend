import {Request, Response} from 'express';
import Subject from '../models/subject';
import Student from '../models/student'

const getSubject = async (req: Request, res: Response) => {
    //El await hace que la siguiente linea no se ejecute
    //hasta que el resultado no se haya obtenido
    let subject = req.params.subject
    try{
        const results = await Subject.find({"_id": subject}).populate('students');
        return res.status(200).json(results);
    } catch (err) {
        return res.status(404).json(err);
    }
}

const addSubject = async (req: Request, res: Response) => {
    const subject = new Subject({
        "name": req.body.name,
        "start": new Date(req.body.start),
        "end": new Date(req.body.end)
    });
    subject.save().then((data) => {
        return res.status(201).json(data);
    }).catch((err) => {
        return res.status(500).json(err);
    })
}

const addStudent = async(req: Request, res: Response) =>{

    //Display request
    console.log(req.body);

    //Set variables for the data found in the request body
    let subject = req.body.subject;

    //Create a new student entity with the data found in request
    let student = new Student({ 
        "name": req.body.name,
        "university": req.body.university,
        "degree": req.body.degree,
        "user": req.body.user,
        "picture": req.body.picture,
        "punctuation": req.body.punctuation,
        "trophies": req.body.trophies,
        "insignias": req.body.insignias
     }); 

    //Look for the student in the database
    let studentdata =await Student.findOne({name: student.name})

    //If the student is not in the database then save it
    if (!studentdata) { 
        await student.save().then((data) => { 
            studentdata = data;
        });
    }
    //Add student to subject
    await Subject.updateOne({"_id": subject}, {$addToSet: {students: studentdata?._id}}).then(result => { 
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

export default {getSubject,addSubject,addStudent};