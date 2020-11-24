import {Router} from 'express';
import userController from "../controllers/user.controller";
import studentController from "../controllers/student.controller";

const router = Router();
//router.get('/all', modelController.getModels);
//router.get('/get/:id', modelController.getModel);

router.post('/new', studentController.newStudent);
//router.post('/edit', modelController.editModel);
export = router
