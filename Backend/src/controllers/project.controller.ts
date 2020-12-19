import { Request, Response } from 'express';
import Course from '../models/course';
import Project from '../models/project';
/**======================
 *    addProject
 *========================**/
const addProject = async(req: Request, res: Response) =>{

    //Display request
    console.log(req.body);
    if(req.body==null){
        res.status(400).send({message: 'Bad Request'});
    }
    if(req.body.subjectId==null|| req.body.ProjectId==null){
        res.status(400).send({message: 'Bad Request'});
    }
    //Set variables for the data found in the request body
    let subjectId:string = req.body.subjectId; 
    const project = new Project({
        "name": req.body.name,
        "teamNames": req.body.teamNames,
        "numberStudents": req.body.numberStudents,
        "hashtags": req.body.hashtags,
        "teams": req.body.teams
    });
    await project.save().then((data) => { 
        //Add Project to subject
        Course.findOne({subject: [subjectId]}).sort({start: -1}).then(course => { 
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

export default {addProject};