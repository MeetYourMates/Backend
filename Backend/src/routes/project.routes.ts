import { Router } from 'express';
import projectController from "../controllers/project.controller";
/**======================
 *    Project Controller
 *========================**/
const router = Router();
router.post('/add', projectController.addProject);

export default router;