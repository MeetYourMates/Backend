"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = require("express");
const auth_controller_1 = __importDefault(require("../controllers/auth.controller"));
const { body, validationResult } = require('express-validator');
const router = express_1.Router();
//*******************************KRUNAL**************************************/
//Using Validator --> check https://github.com/validatorjs/validator.js
//for more validator types
router.post('/signIn', [
    // username must be an email
    body('email').isEmail().normalizeEmail(),
    // password must be at least 3 chars long
    body('password').isLength({ min: 3 })
], auth_controller_1.default.accessUser);
router.post("/changePassword", [
    // username must be an email
    body('email').isEmail().normalizeEmail(),
    body('code').isLength({ min: 7 }).isLength({ max: 7 }),
    // password must be at least 3 chars long
    body('password').exists().isLength({ min: 3 })
], auth_controller_1.default.changePassword);
router.get("/forgotPassword/:email", auth_controller_1.default.forgotPassword);
//*******************************KRUNAL**************************************/
router.post('/signUp', auth_controller_1.default.registerUser);
router.get("/validate/:code", auth_controller_1.default.validateUser);
module.exports = router;
//# sourceMappingURL=auth.routes.js.map