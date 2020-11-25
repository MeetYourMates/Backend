import {Request, Response} from 'express';
import Insignia from '../models/insignia';

const getInsignia = async (req: Request, res: Response) => {
    //El await hace que la siguiente linea no se ejecute
    //hasta que el resultado no se haya obtenido
    try{
        const results = await Insignia.find({});
        return res.status(200).json(results);
    } catch (err) {
        return res.status(404).json(err);
    }
}

const getInsignias = async (req: Request, res: Response) => {
    try{
        const results = await Insignia.find({"user": {"email":req.body.email,"token":req.body.token}});
        return res.status(200).json(results);
    } catch (err) {
        return res.status(404).json(err);
    }
}
const newInsignia = async (req: Request, res: Response) => {
    const insignia = new Insignia({
    
        "title": req.body.title,
        "difficulty": req.body.difficulty,
        "professor": req.body.professor,
        "logo": req.body.logo
    });
    insignia.save().then((data) => {
        return res.status(201).json(data);
    }).catch((err) => {
        return res.status(500).json(err);
    })
}
export default {getInsignias, getInsignia,newInsignia};