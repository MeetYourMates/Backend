"use strict";
/*
import e, {Request, Response} from 'express';
import Model from '../models/model';

const getModel = async (req: Request, res: Response) => {
    //El await hace que la siguiente linea no se ejecute
    //hasta que el resultado no se haya obtenido
    try{
        const results = await Model.find({});
        return res.status(200).json(results);
    } catch (err) {
        return res.status(404).json(err);
    }
}

const getModel = async (req: Request, res: Response) => {
    try{
        const results = await Model.find({"_id": req.params.id});
        return res.status(200).json(results);
    } catch (err) {
        return res.status(404).json(err);
    }
}
function newModel (req: Request, res: Response): void {
    let model = new Model({
        "name" : req.body.name,
        "description" : req.body.description,
        "reportDate" : req.body.reportDate
    });
    model.save().then((data) => {
        return res.status(201).json(data);
    }).catch((err) =>{
        console.log(err);
        return res.status(500).json(err);
    })
}
const editModel = async (req: Request, res: Response) => {

    let model = new Model({
        "_id": req.body._id,
        "name" : req.body.name,
        "description" : req.body.description,
        "reportDate" : req.body.reportDate
    });
    var query = {'_id': model.id};
    delete model._id;
    //Non-null assertion operator ! or ?
    await Model.update(query, model, { multi: false }, function(err,result) {
        if(result.nModified ==1){
            //Found and Updated
            return res.status(200).json(model);
        }else if(result.nModified==0){
            //Not Found
            return res.status(400).json();
        }
        if (err) {
            return res.status(500).json();
          }
    });
}
export default {getModels, getModel, newModel,editModel};
*/ 
