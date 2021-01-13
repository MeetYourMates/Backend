import {Router} from 'express';
import subjectController from "../controllers/subject.controller"

const router = Router();
router.get('/get',subjectController.getSubjects);
router.post('/add', subjectController.addSubject);
router.post('/addCourse', subjectController.addCourse);

export default router;