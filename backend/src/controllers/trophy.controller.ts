import {Request, Response} from 'express';
import Trophy from '../models/trophy';

const getTrophies = async (req: Request, res: Response) => {
    //El await hace que la siguiente linea no se ejecute
    //hasta que el resultado no se haya obtenido
    try{
        const results = await Trophy.find({});
        return res.status(200).json(results);
    } catch (err) {
        return res.status(404).json(err);
    }
}

const getTrophy = async (req: Request, res: Response) => {
    try{
        const results = await Trophy.find({"user": {"email":req.body.email,"token":req.body.token}});
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
        "logo": req.body.logo
    });
    trophy.save().then((data) => {
        return res.status(201).json(data);
    }).catch((err) => {
        return res.status(500).json(err);
    })
}
export default {getTrophies, getTrophy,newTrophy};