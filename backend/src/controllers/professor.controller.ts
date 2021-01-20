import {Request, Response} from 'express';
import Student from '../models/student';
import Professor from '../models/professor';
import Subject from '../models/subject';


/*
Devuelve lista de Course de un Student, con información básica de los Student que hay en cada Course
y con el nombre del Subject al que pertenece cada Course. Esta petición está diseñada para el search_mates, 
que muestra toda esta información en una misma pantalla. Como manejar consultas asincronas a tres modelos 
diferentes nos complica mucho el Frontend, creamos esta consulta que contenga todo lo necesario.
En el Frontend se recogerá dentro de un un objeto AdHoc, diseñado específicamente para search_mates.

Estructura del resultado:

[
    {
        '_id',
        'start',
        'end',
        'students': [
            {
                '_id',
                'name',
                'picture'
            }
        ],
        'subjectName'
    }
]

*/
const getStudentsAndCourses = async (req: Request, res: Response) => {
    try{
        //Busca los cursos del Student por su id
        //El metodo lean() nos permite modificar el objecto en el próximo bucle, para poder enviar info extra.
        if(req.params.id==null){return res.status(400).json("{'error':'Bad Request'}"); }
        let result = await Professor.findOne({_id:req.params.id}).select('courses user').populate({
            path: 'courses',
            select:'start end students subject',
        }).lean();
        let myId:string = result['user'].toString();
        //"Limpia" la encapsulación del json
        let results = result['courses'];
        //Ahora añadimos en el resultado el nombre del subject de cada course, para facilitarle la vida al frontend
        for (var course of results) {
            var subject = await Subject.find({_id:course['subject']});
            course['subjectName'] = subject[0]['name'];
            //Limpia los campos que no interesan
            delete course['subject'];
            //Myself shoudlnt be send to myself! Bad Practice that's why this below!!
            let filter = {$and: [ {courses:course['_id']},{"user": { $ne:myId}}]};
            course['students'] = await Student.find(filter).select('user degree university').populate('ratings').populate('trophies').populate('insignias').populate({
                path: 'user',
                model: 'User',
                select: 'picture name email'
            });
          }
        //console.debug(results);
        return res.status(200).json(results);
    } catch (err) {
        console.log(err);
        return res.status(404).json(err);
    }
}
/************************************************************************/


/*************** PEP *************/
/*
Estructura del resultado:

[
    {
        "_id",
        "start",
        "end",
        "projects": [
            {
                "name"
            }
        ],
        "subjectName":"
    }
]
*/
//Return the projects of the courses of the professor
const getCourseProjects = async (req: Request, res: Response) => {
    try{
        //Busca los cursos del Professor por su id
        //El metodo lean() nos permite modificar el objecto en el próximo bucle, para poder enviar info extra.
        if(req.params.id==null){return res.status(400).json("{'error':'Bad Request'}"); }
        let result = await Professor.findOne({_id:req.params.id}).select('courses').populate({
            //add info about the course
            path: 'courses',
            select:'start end subject projects',
            populate:{
                //add info about the project
                path: 'projects',
                select: 'name'
            }
        }).lean();
        //clean json format
        let results = result['courses'];
        for (var course of results) {
            //Add subject name
            var subject = await Subject.find({_id:course['subject']});
            course['subjectName'] = subject[0]['name'];
            //Limpia los campos que no interesan
            delete course['subject'];
          }
        return res.status(200).json(results);
    } catch (err) {
        console.log(err);
        return res.status(404).json(err);
    }
}

export default {getStudentsAndCourses,getCourseProjects};