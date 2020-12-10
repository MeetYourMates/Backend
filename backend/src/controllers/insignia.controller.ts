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
        const results = await Insignia.find({"user": {"_id":req.body._id}});
        return res.status(200).json(results);
    } catch (err) {
        return res.status(404).json(err);
    }
}
const newInsignia = async (req: Request, res: Response) => {
    const insignia = new Insignia({
    
        "hashtag": req.body.hashtag,
        "requirement": req.body.requirement,
        "date": req.body.date,
        "logo": req.body.logo
    });
    insignia.save().then((data) => {
        return res.status(201).json(data);
    }).catch((err) => {
        return res.status(500).json(err);
    })
}
function updateInsignia (req: Request, res: Response){
    const id: string = req.body._id;
    const hashtag: string = req.params.hashtag;
    const requirement: number = req.body.requirement;
    const date: Date = req.body.date;
    const logo: string = req.body.logo;

    Insignia.update({"_id": id}, {$set: {"hashtag": hashtag, "requirement": requirement, "date": date, 
                              "logo": logo}}).then((data) => {
        res.status(201).json(data);
    }).catch((err) => {
        res.status(500).json(err);
    })
}
function deleteInsignia (req:Request,res:Response){
    Insignia.deleteOne({"_id":req.params._id}).then((data) => {
        res.status(200).json(data);
    }).catch((err) => {
        res.status(500).json(err);
    })
}
export default {getInsignias, getInsignia,newInsignia, updateInsignia, deleteInsignia};