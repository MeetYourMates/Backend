import { Router } from 'express';
import courseController from "../controllers/course.controller";

const router = Router();

router.post('/get', courseController.getCourse);
router.post('/add', courseController.addCourse);
router.post('/addStudent', courseController.addStudent);
router.post('/addProfessor', courseController.addProfessor);
router.post('/addProject', courseController.addProject);
router.get('/getStudents/:course', courseController.getCourseStudents);
export default router;