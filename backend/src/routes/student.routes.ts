
import {Router} from 'express';
import userController from "../controllers/user.controller";

import studentController from "../controllers/auth.controller"
const router = Router();
//router.get('/all', modelController.getModels);
//router.get('/get/:id', modelController.getModel);
router.post("/signUp", studentController.registerStudent);

//router.post('/edit', modelController.editModel);
export = router
