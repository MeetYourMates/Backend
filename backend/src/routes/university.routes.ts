import {Router} from 'express';
import universityController from "../controllers/university.controller"
import passport from "passport";
const router = Router();
//*******************************KRUNAL**************************************/
router.get('/all',passport.authenticate("jwt", { session: false }), universityController.getUniversities);
router.post('/add',passport.authenticate("jwt", { session: false }), universityController.addUniversity);
router.post('/addFaculty/:university',passport.authenticate("jwt", { session: false }), universityController.addFaculty);
//*******************************KRUNAL**************************************/

export default router;