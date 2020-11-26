import {Router} from 'express';
import studentController from "../controllers/student.controller"


const router = Router();
router.get('/getAll', studentController.getStudents);
router.get('/get/:id', studentController.getStudent);
router.put('/SignUp', studentController.newStudent);
router.post('/EditProfile', studentController.updateStudent);
router.delete('/DeleteProfile', studentController.deleteStudent);
export default router;
