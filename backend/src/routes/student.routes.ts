import {Router} from 'express';
import studentController from "../controllers/student.controller"


const router = Router();
router.get('/all', studentController.getStudents);
router.put('/updateStudent', studentController.updateStudentProfile);
router.get('/getSubjectsProjects/:email', studentController.getSubjectsProjects);

//router.post('/edit', modelController.editModel);

export default router;
