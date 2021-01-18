import {Request, Response} from 'express';
import Meeting from '../models/meeting';
import Team from '../models/team';
import User from "../models/user";
const getMeetings = async (req: Request, res: Response) => {
    try{
        Team.findOne({"_id": req.params.id}).select('meetings').populate('meetings').lean().then((results)=>{
            /*if(results==null){
             return res.status(200).json(results['meetings']);
            }*/
            return res.status(200).json(results);
        });
    } catch (err) {
        return res.status(404).json(err);
    }
}
const newMeeting = async (req: Request, res: Response) => {
    //required params teamId, Meeting params(Not nested object!)--> name,description,date, location
    let meeting = new Meeting({
        "name": req.body.name,
        "description": req.body.description,
        "date": req.body.date,
        "location": req.body.location,
    });
    meeting.save().then(function(resultMeeting){
        //Once saved meeting, need to add the meeting id in team
        if(resultMeeting != null){
        const queryUpdate = { _id: req.body.teamId };
        // @ts-ignore
        Team.updateOne( queryUpdate, { "$push": { meetings: [meeting._id] } } ).lean().then( function(){
        //console.debug( "Chat added to user:  ", updateRes );
        return res.status(201).json(resultMeeting);
        } ).catch( ( err ) =>
        {
            return res.status(500).json('{"message":"Unable to add reunion in team"}');
        });
        }else{
           return res.status(500).json('{"message":"Unable to create reunion"}');
        }
        return res.status(201).json(resultMeeting);
    }).catch((err) => {
        return res.status(500).json(err);
    })
}
/*
function updateMeeting (req: Request, res: Response){
    const id: string = req.body._id;
    const title: string = req.params.title;
    const difficulty: number = req.body.difficulty;
    const professor: string = req.body.professor;
    const date: Date = req.body.date;
    const logo: string = req.body.logo;

    Trophy.update({"_id": id}, {$set: {"title": title, "difficulty": difficulty, "professor": professor, "date": date,
            "logo": logo}}).then((data) => {
        res.status(201).json(data);
    }).catch((err) => {
        res.status(500).json(err);
    })
}
function deleteMeeting (req:Request,res:Response){
    Trophy.deleteOne({"_id":req.params._id}).then((data) => {
        res.status(200).json(data);
    }).catch((err) => {
        res.status(500).json(err);
    })
}*/
export default {getMeetings,newMeeting,/* updateMeeting, deleteMeeting*/};