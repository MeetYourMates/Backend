import {Router} from "express";
import studentController from "../controllers/auth.controller"

const router = Router();

router.post("/signUp", studentController.registerStudent);

export = router;
