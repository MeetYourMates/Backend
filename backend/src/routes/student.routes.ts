import {Router} from 'express';
import studentController from "../controllers/student.controller"
import professorController from "../controllers/professor.controller";


const router = Router();
router.get('/all', studentController.getStudents);
router.put('/updateStudent', studentController.updateStudentProfile);
router.get('/getSubjectsProjects/:email', studentController.getSubjectsProjects);
router.get('/getStudentCourses/:id', studentController.getStudentCourses);
router.get('/getStudentsAndCourses/:id', studentController.getStudentsAndCourses);
router.get('/getStudentProjects/:id', studentController.getSubjectsProjects);
router.get('/getCourseProjects/:id', studentController.getCourseProjects);
router.get('/verifyRating/:id', studentController.verifyRating);
router.post('/rateMate', studentController.rateMate);

//router.post('/edit', modelController.editModel);

export default router;
