import { Request, Response } from 'express';
import Team from '../models/team';
import Task from '../models/task';
/******************************MAITE***************************************/
const addTask = async(req: Request, res: Response) =>{

    //Display request
    console.log(req.body);
    if(req.body==null){
        return res.status(400).send({message: 'Bad Request'});
    }
    if(req.body.teamId==null){
        return res.status(400).send({message: 'Bad Request'});
    }
    //Set variables for the data found in the request body
    let teamId:string = req.body.teamId;
    const task = new Task({
        "name": req.body.name,
        "description": req.body.description,
        "deadline": req.body.deadline,
        "assignees": req.body.assignees,
        "completed": false,
        "hashtag": req.body.hashtag

    });
    task.save().then((data) => {
        //Add Task to Team
        // @ts-ignore
        Team.updateOne({"_id":req.body.teamId}, {$addToSet: {tasks: data!._id}}).then(result => {
            if (result.nModified> 0) {
               return res.status(201).send({message: 'Task added succesfully!'});
            }else{
                return res.status(409).send({message: 'Task was already added!'});
            }
        });
        }).catch((err) => {
            console.log("error ", err);
            return res.status(500).json({message: 'Server Error!'});
        });

}
const getTasksFromTeam = async (req: Request, res: Response) => {
    //El await hace que la siguiente linea no se ejecute
    //hasta que el resultado no se haya obtenido
    try{
        let results = await Team.findOne({_id:req.params.id}).select('tasks').populate({
            path: 'tasks',
        }).lean();
        //"Limpia" la encapsulación del json
        //results = results['tasks'];
        console.log(results);
        return res.status(200).json(results);

    } catch (err) {
        return res.status(404).json(err);
    }

}

const complete = async(req: Request, res: Response) =>{

    //Display request
    console.log(req.body);
    if(req.body==null){
        res.status(400).send({message: 'Bad Request'});
    }
    if(req.body.subjectId==null){
        res.status(400).send({message: 'Bad Request'});
    }
    //Set variables for the data found in the request body
    let taskId:string = req.body.taskId;
    let complete:boolean = req.body.complete;
    //@ts-ignore
    Task.updateOne({"_id":taskId}, {completed: complete}).then(result => {
        if (result.nModified> 0) {
            res.status(201).send({message: 'Task ended succesfully!'});
        }else {
            //No Course Found
            res.status(400).send({message: 'No Subject in Database'});
        }
        }).catch((err) => {
        console.log("error ", err);
        res.status(500).json({message: 'Server Error!'});
        })}
/*********************************************************************/
export default {addTask,getTasksFromTeam,complete};