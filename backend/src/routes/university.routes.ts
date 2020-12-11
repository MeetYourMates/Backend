import {Router} from 'express';
import universityController from "../controllers/university.controller"
import passport from "passport";
const router = Router();

router.get('/all', universityController.getUniversities);
router.post('/add', universityController.addUniversity);
router.post('/addFaculty/:university', universityController.addFaculty);
//*******************************KRUNAL**************************************/
//router.post('/addFaculty/:university',passport.authenticate("jwt", { session: false }), universityController.addFaculty);
//*******************************KRUNAL**************************************/

export default router;