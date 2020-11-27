import {Router} from 'express';
import universityController from "../controllers/university.controller"

const router = Router();
router.get('/all', universityController.getUniversities);
router.post('/add', universityController.addUniversity);
router.post('/addFaculty/:university', universityController.addFaculty);


export default router;