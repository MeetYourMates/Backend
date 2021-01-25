import { Request, Response } from 'express';
import Course from '../models/course';
import Project from '../models/project';
/******************************MAITE***************************************/
const addProject = async(req: Request, res: Response) =>{

    //Display request
    console.log(req.body);
    if(req.body==null){
        res.status(400).send({message: 'Bad Request'});
    }
    if(req.body.id==null){
        res.status(400).send({message: 'Bad Request'});
    }
    //Set variables for the data found in the request body
    let courseId:string = req.body.id; 
    const project = new Project({
        "name": req.body.name,
        "numberStudents": req.body.numberStudents,
    });
    project.save().then((data) => {
        //Add Project to subject
        Course.findOne({"_id": [courseId]}).then(course => { 
            //No error and we got a result
            console.log("Adding Course to Project: ");
            console.log([course]);
            if(course!=null){
                //We got the course now we search if the Project has this course 
                //@ts-ignore
                Course.updateOne({"_id":course?._id}, {$addToSet: {projects: data!._id}}).then(result => {
                    if (result.nModified> 0) {
                        res.status(201).send({message: 'Project Enrolled succesfully!'}); 
                    }else{
                        res.status(409).send({message: 'Project was already Enrolled!'}); 
                    }
                });
            }else{
                //No Course Found
                res.status(400).send({message: 'No Subject in Database'});
            }

    }).catch((err) => { 
        console.log("error ", err); 
        res.status(500).json({message: 'Server Error!'}); 
    });
    });
    
}
const getProjectsFromCourse = async (req: Request, res: Response) => {
    //El await hace que la siguiente linea no se ejecute
    //hasta que el resultado no se haya obtenido
    try{
        let results = await Course.find({_id:req.params.id}).select('projects').populate({
            path: 'projects',
            select:'_id name',
        }).lean();
        //"Limpia" la encapsulación del json
        results = results[0]['projects'];
        console.log(results);
        return res.status(200).json(results);

    } catch (err) {
        return res.status(404).json(err);
    }

}
/*********************************************************************/
export default {addProject,getProjectsFromCourse};