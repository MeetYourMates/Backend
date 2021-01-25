import { Request, Response } from 'express';
import Project from '../models/project';
import Team from '../models/team';
/******************************KRUNAL***************************************/
const addTeam = async(req: Request, res: Response) =>{

    //Display request
    console.log(req.body);
    if(req.body==null){
        res.status(400).send({message: 'Bad Request'});
    }
    if(req.body.projectId==null){
        res.status(400).send({message: 'Bad Request'});
    }
    //Set variables for the data found in the request body
    let projectId:string = req.body.projectId;
    const team = new Team({
        "name": req.body.name,
        "numberStudents":req.body.numberStudents,
    });
    team.save().then((data) => {
        //Add Project to subject
        Project.findOne({_id: projectId}).then(project => {
        //No error and we got a result
        console.log("Adding team to Project: ");
        console.log([project]);
        if(project!=null){
            //We got the course now we search if the Project has this course 
            //@ts-ignore
            Project.updateOne({"_id":projectId}, {$addToSet: {teams: data!._id}}).then(result => {
                if (result.nModified> 0) {
                    res.status(201).send({message: 'Team Enrolled successfully!'});
                }else{
                    res.status(409).send({message: 'Team was already Enrolled!'});
                }
            });
        }else{
            //No Course Found
            res.status(400).send({message: 'No Project in Database'});
        }

        }).catch((err) => {
            console.log("error ", err);
            res.status(500).json({message: 'Server Error!'});
        });
    });
    
}
const getTeams = async (req: Request, res: Response) => {
    //El await hace que la siguiente linea no se ejecute
    //hasta que el resultado no se haya obtenido
    try{
        let results = await Project.findOne({_id:req.params.id}).select('teams').populate({
            path: 'teams',
            select:'_id name numberStudents',
        }).lean();
        //"Limpia" la encapsulación del json
        results = results['teams'];
        console.log(results);
        return res.status(200).json(results);

    } catch (err) {
        return res.status(404).json(err);
    }

}
/*********************************************************************/
export default {addTeam,getTeams};