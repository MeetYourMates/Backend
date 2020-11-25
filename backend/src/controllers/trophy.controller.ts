import {Request, Response} from 'express';
import Trophy from '../models/trophy';

const getTrophies = async (req: Request, res: Response) => {
    //El await hace que la siguiente linea no se ejecute
    //hasta que el resultado no se haya obtenido
    try{
        const results = await Trophy.find({}).populate('user');
        return res.status(200).json(results);
    } catch (err) {
        return res.status(404).json(err);
    }
}