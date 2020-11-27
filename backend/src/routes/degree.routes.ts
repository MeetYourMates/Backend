import {Router} from 'express';
import degreeController from "../controllers/degree.controller"

const router = Router();
router.post('/add', degreeController.addDegree);
router.post('/addSubject', degreeController.addSubject);

export default router;