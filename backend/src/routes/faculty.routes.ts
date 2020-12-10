import {Router} from 'express';
import facultyController from "../controllers/faculty.controller"

const router = Router();
router.post('/add', facultyController.addFaculty);
router.post('/addDegree', facultyController.addDegree);

export default router;