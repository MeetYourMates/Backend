import {Request, Response} from 'express';
import University from '../models/university';
import Faculty from '../models/faculty';

const getUniversities = async (req: Request, res: Response) => {
    //El await hace que la siguiente linea no se ejecute
    //hasta que el resultado no se haya obtenido
    try{
        const results = await University.find({})
        .populate({
            path: 'faculties', 
            model: 'Faculty',
            populate: {
                path: 'degrees',
                model: 'Degree'
            }}).exec();
        console.log(results);
        return res.status(200).json(results);
        
    } catch (err) {
        return res.status(404).json(err);
    }
    
}
const addUniversity = async (req: Request, res: Response) => {
    const insignia = new University({
    
        "name": req.body.name
    });
    insignia.save().then((data) => {
        return res.status(201).json(data);
    }).catch((err) => {
        return res.status(500).json(err);
    })
}
const addFaculty = async(req: Request, res: Response) =>{

    //Display request
    console.log(req.body);

    //Set variables for the data found in the request body
    let university = req.params.university;

    //Create a new student entity with the data found in request
    let faculty = new Faculty({ 
        "name": req.body.name
     }); 

    //Look for the student in the database
    let facultydata =await Faculty.findOne({name: faculty.name})

    //If the student is not in the database then save it
    if (!facultydata) { 
        await faculty.save().then((data) => { 
            facultydata = data;
        });
    }
    //Add student to subject
    await University.updateOne({"name": university}, {$addToSet: {faculties: facultydata?._id}}).then(result => { 
        if (result.nModified == 1) { 
            console.log("Faculty added successfully"); 
            res.status(201).send({message: 'Faculty added successfully'}); 
        } else { 
            res.status(409).json('Faculty was already added!') 
    } }).catch((err) => { 
        console.log("error ", err); 
        res.status(500).json(err); 
    }); 
}

export default {getUniversities,addUniversity,addFaculty};