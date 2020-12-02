import {Router} from 'express';
import subjectController from "../controllers/course.controller"

const router = Router();
router.post('/get', subjectController.getCourse);
router.post('/add', subjectController.addCourse);
router.post('/addStudent', subjectController.addStudent);
router.post('/getStudents', subjectController.getCourseStudents);

export default router;