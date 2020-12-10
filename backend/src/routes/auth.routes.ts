import {Router} from 'express';
import authController from "../controllers/auth.controller";

const router = Router();

router.post('/signIn', authController.accessUser);
router.post('/signUp', authController.registerUser);
router.get("/validate/:code", authController.validateUser);
router.post("/changePassword", authController.changePassword);
router.get("/forgotPassword/:email", authController.forgotPassword);
export = router
