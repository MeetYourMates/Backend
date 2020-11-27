import {Request, Response} from 'express';
import Trophy from '../models/trophy';

const getTrophies = async (req: Request, res: Response) => {
    //El await hace que la siguiente linea no se ejecute
    //hasta que el resultado no se haya obtenido
    try{
        const results = await Trophy.find({"_id": req.body._id});
        return res.status(200).json(results);
    } catch (err) {
        return res.status(404).json(err);
    }
}

const getTrophy = async (req: Request, res: Response) => {
    try{
        const results = await Trophy.find({"_id": req.body._id});
        return res.status(200).json(results);
    } catch (err) {
        return res.status(404).json(err);
    }
}
const newTrophy = async (req: Request, res: Response) => {
    const trophy = new Trophy({
    
        "title": req.body.title,
        "difficulty": req.body.difficulty,
        "professor": req.body.professor,
        "date": req.body.date,
        "logo": req.body.logo
    });
    trophy.save().then((data) => {
        return res.status(201).json(data);
    }).catch((err) => {
        return res.status(500).json(err);
    })
}
function updateTrophy (req: Request, res: Response){
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
function deleteTrophy (req:Request,res:Response){
    Trophy.deleteOne({"_id":req.params._id}).then((data) => {
        res.status(200).json(data);
    }).catch((err) => {
        res.status(500).json(err);
    })
}
export default {getTrophies, getTrophy,newTrophy, updateTrophy, deleteTrophy};