import {Router} from 'express';
import authController from "../controllers/auth.controller";
const { body, validationResult } = require('express-validator');
const router = Router();
//*******************************KRUNAL**************************************/
//Using Validator --> check https://github.com/validatorjs/validator.js
//for more validator types
router.post('/signIn',[
    // username must be an email
    body('email').isEmail().normalizeEmail(),
    // password must be at least 3 chars long
    body('password').isLength({ min: 3 })
  ], authController.accessUser);
router.post("/changePassword",[
    // username must be an email
    body('email').isEmail().normalizeEmail(),
    body('code').isLength({ min: 7 }).isLength({ max: 7 }),
    // password must be at least 3 chars long
    body('password').exists().isLength({ min: 3 })
  ], authController.changePassword);
router.get("/forgotPassword/:email", authController.forgotPassword);
//*******************************KRUNAL**************************************/
router.post('/signUp', authController.registerUser);
router.get("/validate/:code", authController.validateUser);
export = router
