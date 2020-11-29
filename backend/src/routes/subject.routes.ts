import {Router} from 'express';
import subjectController from "../controllers/subject.controller"

const router = Router();
router.post('/add', subjectController.addSubject);
router.post('/addCourse', subjectController.addCourse);

export default router;