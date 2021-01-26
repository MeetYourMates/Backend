import { Request, Response } from 'express';
import mongoose from "mongoose";
import Invitation from "../models/invitation";
import Project from '../models/project';
import Student from "../models/student";
import Team, { ITeam } from '../models/team';
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
    let teams:Array<ITeam> = req.body.teams;
    let teamsResult=[];
    Project.findOne({_id: projectId}).then(async project => {

        if (project != null) {
            console.log("Adding team to Project: ");
            for (const teamCurr of teams) {

                const team = new Team({
                    "name": teamCurr.name,
                    "numberStudents": teamCurr.numberStudents,
                });
              let data = await  team.save();
                //Add Project to subject
                //@ts-ignore
                let result = await Project.updateOne({"_id": projectId}, {$addToSet: {teams: data!._id}})/*.then(result => {*/
                if (result.nModified <= 0) {
                    res.status(409).send({message: 'Team was already Enrolled!'});
                }else{
                    teamsResult.push(data);
                    console.log(teamsResult);
                }

               /* });*/

            }
            res.status(201).json(teamsResult);

        } else {
            //No Project Found
            res.status(400).send({message: 'No Project in Database'});
        }
        }).catch((err) => {
        console.log("error ", err);
        res.status(500).json({message: 'Server Error!'});
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
const getTeamsStudent = async (req: Request, res: Response) => {
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
const joinTeam = async (req: Request, res: Response) => {

    let teamId = req.params.id;
    let studentId = req.body.studentId;
    let searchedTeam = null;
    try {searchedTeam =  await Team.findOne({"_id": teamId});}
    catch (e) {res.status(409).send({message: 'Not finding the team'});}
    if (searchedTeam != null) {
        let searchStudent = await Student.findOne({"teams": {$in: teamId} })
        if (searchStudent != null) {
            res.status(409).send({message: 'There is already a person in the team'});
        }
        else {
            console.log(searchedTeam._id);
            // @ts-ignore
            Student.updateOne({"_id": studentId}, {$addToSet: {teams: searchedTeam._id}}).then(results => {
                console.log(results.nModified);
                res.status(201).send({message: 'Joined the team'});
            });
        }
    }
}

const inviteStudent = async (req: Request, res: Response) => {
    let teamId = req.body.teamId;
    let senderId = req.body.senderId;
    let receiverId = req.body.receiverId;
    let searchedTeam = null;
    try {searchedTeam =  await Team.findOne({"_id": teamId});}
    catch (e) {res.status(409).send({message: 'Not finding the team'});}
    if (searchedTeam != null) {
        let studentsInTeam = await Student.find({"teams": {$in: teamId} });
        if (studentsInTeam.length < searchedTeam.numberStudents) {
            let newInv = new Invitation({
                sender: mongoose.Types.ObjectId(senderId),
                receiver: mongoose.Types.ObjectId(receiverId),
                team: mongoose.Types.ObjectId(teamId)
            });
            newInv.save().then((result) => {
                console.log(result);
                res.status(201).send({message: 'Invitation sent'});
            });
        }
        else {
            res.status(400).send({message: 'Cant invite more people to the team'});
        }
    }
}

const getInvitations = async (req: Request, res: Response) => {
    let receiverId = req.params.id;
    console.log(receiverId);
    try {
        let invited = await Invitation.find({receiver: receiverId}).populate([{path: "sender", select:"user", populate:{path: "user", select: "name"}},
            {path: "receiver", select:"user"},
            {path: "team", select:"name"}]);
        console.log(invited);
        return res.status(200).json(invited);
    }
    catch (e) {
        return res.status(400);
    }
}

const invitationAction = async (req: Request, res: Response) => {
    let invId = req.params.id;
    let action = req.params.action;
    let invit = await Invitation.findOne({_id: invId});
    if (action == "accept") {
        // @ts-ignore
        Student.updateOne({"_id": invit.receiver}, {$addToSet: {teams: invit.team}}).then(results => {
            console.log(results.nModified);
            Invitation.deleteMany({"_id": invit.receiver}).then(() => {
                res.status(201).send({message: 'Joined the team'});
            })

        });
    }
    if (action == "reject") {
        invit.deleteOne().then((results) => {
            res.status(201).send({message: 'Rejected Invitation'});
        });

    }
}
/*********************************************************************/

/*************** PEP *************/
//Updates team
const updateTeam = async (req: Request, res: Response) => {
    console.log(req.body);
    //Only Updates Name and  Picture
    Team.findByIdAndUpdate({"_id": req.body._id}, {$set: {"name": req.body.name,"numberStudents":req.body.numberStudents}}).then((data) => {
        if(data==null) return res.status(400).json(req.body);
        res.status(200).json(req.body);
    }).catch((err) => {
        res.status(500).json(err);
    })
}
/************************************************************************/


export default {addTeam,getTeams,getTeamsStudent, joinTeam, inviteStudent, getInvitations, invitationAction, updateTeam};
