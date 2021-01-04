import { Router } from 'express';
import projectController from "../controllers/project.controller";
const router = Router();
router.post('/add', projectController.addProject);
router.get('/course/:id',projectController.getProjectsFromCourse);
export default router;