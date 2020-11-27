import {Router} from 'express';
import subjectController from "../controllers/subject.controller"

const router = Router();
router.post('/get', subjectController.getSubject);
router.post('/add', subjectController.addSubject);
router.post('/addFaculty', subjectController.addStudent);

export default router;