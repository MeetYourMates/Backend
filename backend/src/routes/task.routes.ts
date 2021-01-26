import {Router} from 'express';
import taskController from "../controllers/task.controller"

const router = Router();
router.get('/get/:id',taskController.getTasksFromTeam);
router.post('/add', taskController.addTask);
router.post('/complete',taskController.complete);
export default router;