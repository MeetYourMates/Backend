import { Request, Response } from 'express';
import Student from '../models/student';
import Course from '../models/course';
import User from '../models/user';
import Subject from '../models/subject';



const getStudents = async (req: Request, res: Response) => {
    try{
        const results = await Student.find({}).populate('users','trophies','insignias');
        //TODO: Security Risk!!! SENDING PASSWORD OF STUDENTS INSIDE USERS DB
        return res.status(200).json(results);
    } catch (err) {
        return res.status(404).json(err);
    }
}
const getStudent = async (req: Request, res: Response) => {
    try{
        const results = await Student.find({"user": {"email":req.body.email}}).populate('users');
        return res.status(200).json(results);
    } catch (err) {
        return res.status(404).json(err);
    }
}
const getSubjectsProjects = async (req: Request, res: Response) => {
    try{
        const results = await Student.find({"user":{"email":req.params.email}})
    .populate({
        path: 'courses', 
        model: 'Course',
        populate: [{
            path: 'subjects',
            model: 'Subject'
        }, 
        {
            path: 'projects',
            model: 'Project'
        }]}).exec();

        return res.status(200).json(results);
    } catch (err) {
        return res.status(404).json(err);
    }
    
}
const addStudent = async (req: Request, res: Response) => {
    const student = new Student({
        "name": req.body.name,
        "university": req.body.university,
        "degree": req.body.degree,
        "user": req.body.user,
        "picture": req.body.picture,
        "rating": req.body.punctuation,
        "trophies": req.body.trophies,
        "insignias": req.body.insignias,
        "courses": req.body.courses,
        "chats": req.body.chats
    });
    student.save().then((data) => {
        return res.status(201).json(data);
    }).catch((err) => {
        return res.status(500).json(err);
    })
}
/******************************POL***************************************/
function updateStudentProfile (req: Request, res: Response){
    console.log(req.body);
    //Only Updates Name and  Picture
    User.findByIdAndUpdate({"_id": req.body.user._id}, {$set: {"name": req.body.user.name,"picture":req.body.user.picture}}).then((data) => {
        if(data==null) return res.status(400).json(req.body);
        Student.findByIdAndUpdate({"_id": req.body._id},{$set: {"ratings": req.body.ratings,"trophies":req.body.trophies,"insignias":req.body.insignias}},{
            new: true
          }).then((resultStudent)=>{
          if(resultStudent==null){return res.status(400).json(req.body);}
          console.log("***************************************");
          console.log(resultStudent);
          res.status(200).json(req.body);
        })
    }).catch((err) => {
        res.status(500).json(err);
    })
}
/***************************************************************************/

function deleteStudent (req:Request,res:Response){
    Student.deleteOne({"_id":req.params._id}).then((data) => {
        res.status(200).json(data);
    }).catch((err) => {
        res.status(500).json(err);
    })
}


/******************************PEP***************************************/
const getStudentCourses = async (req: Request, res: Response) => {
    try{
        //Busca los cursos del Student por su id
        var results = await Student.find({_id:req.params.id}).select('courses').populate('courses').lean();
        results = results[0]['courses'];
        return res.status(200).json(results);//Ignoro vector student y me meto directamente en los courses, así ahorro complicaciones en el frontend
    } catch (err) {
        console.log(err);
        return res.status(404).json(err);
    }
}
/************************************************************************/

/******************************PEP***************************************/
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
        var results = await Student.find({_id:req.params.id}).select('courses').populate({
            path: 'courses',
            select:'start end students subject',
        }).lean();
        //"Limpia" la encapsulación del json
        results = results[0]['courses'];
        //Ahora añadimos en el resultado el nombre del subject de cada course, para facilitarle la vida al frontend
        for (var course of results) {
            var subject = await Subject.find({_id:course['subject']});
            course['subjectName'] = subject[0]['name'];
            //Limpia los campos que no interesan
            delete course['subject'];

            var students = await Student.find({courses:course['_id']}).select('user degree university').populate({
                path: 'user',
                model: 'User',
                select: 'picture name'
            });
            course['students'] = students;
          }
        console.log(results);
        return res.status(200).json(results);
    } catch (err) {
        console.log(err);
        return res.status(404).json(err);
    }
}
/************************************************************************/


export default {getStudents, getStudent,addStudent,getSubjectsProjects,updateStudentProfile,getStudentCourses,getStudentsAndCourses};
