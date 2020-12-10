import {Request, Response} from 'express';
import Degree from '../models/degree';
import Faculty from '../models/faculty';

const addFaculty = async (req: Request, res: Response) => {
    const faculty = new Faculty({
        "name": req.body.name
    });
    faculty.save().then((data) => {
        return res.status(201).json(data);
    }).catch((err) => {
        return res.status(500).json(err);
    })
}
const addDegree = async(req: Request, res: Response) =>{

    //Display request
    console.log(req.body);

    //Set variables for the data found in the request body
    let faculty = req.body.faculty;

    //Create a new student entity with the data found in request
    let degree = new Degree({ 
        "name": req.body.name
     }); 

    //Look for the student in the database
    let degreedata =await Degree.findOne({name: degree.name});

    //If the student is not in the database then save it
    if (!degreedata) { 
        await degree.save().then((data) => { 
            degreedata = data;
        });
    }
    //Add student to subject
    await Faculty.updateOne({"_id": faculty}, {$addToSet: {degrees: degreedata?._id}}).then(result => { 
        if (result.nModified == 1) { 
            console.log("Degree added successfully"); 
            res.status(201).send({message: 'Degree added successfully'}); 
        } else { 
            res.status(409).json('Degree was already added!') 
    } }).catch((err) => { 
        console.log("error ", err); 
        res.status(500).json(err); 
    }); 
}

export default {addFaculty,addDegree};