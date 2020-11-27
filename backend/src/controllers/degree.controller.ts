import {Request, Response} from 'express';
import Degree from '../models/degree';
import Subject from '../models/subject';

const addDegree = async (req: Request, res: Response) => {
    const degree = new Degree({
    
        "name": req.body.name
    });
    degree.save().then((data) => {
        return res.status(201).json(data);
    }).catch((err) => {
        return res.status(500).json(err);
    })
}
const addSubject = async(req: Request, res: Response) =>{

    //Display request
    console.log(req.body);

    //Set variables for the data found in the request body
    let degree = req.body.degree;

    //Create a new student entity with the data found in request
    let subject = new Subject({ 
        "name": req.body.name,
        "start": new Date(req.body.start),
        "end": new Date(req.body.start)
     }); 

    //Look for the student in the database
    let subjectdata =await Subject.findOne({name: subject.name})

    //If the student is not in the database then save it
    if (!subjectdata) { 
        await subject.save().then((data) => { 
            subjectdata = data;
        });
    }
    //Add student to subject
    await Degree.updateOne({"_id": degree}, {$addToSet: {subjects: subjectdata?._id}}).then(result => { 
        if (result.nModified == 1) { 
            console.log("Subject added successfully"); 
            res.status(201).send({message: 'Subject added successfully'}); 
        } else { 
            res.status(409).json('Subject was already added!') 
    } }).catch((err) => { 
        console.log("error ", err); 
        res.status(500).json(err); 
    }); 
}

export default {addDegree, addSubject};