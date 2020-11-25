import {Router} from 'express';
import studentController from "../controllers/student.controller"


const router = Router();
router.get('/all', studentController.getStudents);
//router.get('/get/:id', modelController.getModel);
//router.post('/edit', modelController.editModel);

export default router;
