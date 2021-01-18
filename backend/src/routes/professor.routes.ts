import { Router } from 'express';
import professorController from "../controllers/professor.controller";


const router = Router();


/* router.get('/all', professorController.getStudents);
router.put('/updateProfessor', professorController.updateStudentProfile);
router.get('/getProfessorProjects/:email', professorController.getSubjectsProjects);
router.get('/getProfessorCourses/:id', professorController.getStudentCourses); */
router.get('/getStudentsAndCourses/:id', professorController.getStudentsAndCourses);
router.get('/getCourseProjects/:id', professorController.getCourseProjects);
/* router.get('/getProjects/:id', professorController.getSubjectsProjects); */

//router.post('/edit', modelController.editModel);

export default router;
