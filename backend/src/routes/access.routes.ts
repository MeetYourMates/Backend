import {Router} from 'express';
import userController from "../controllers/user.controller";

const router = Router();
//router.get('/all', modelController.getModels);
//router.get('/get/:id', modelController.getModel);
router.post('/', userController.accessUser);
router.post('/new', userController.newUser);
//router.post('/edit', modelController.editModel);
export = router
