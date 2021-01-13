"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var university_controller_1 = __importDefault(require("../controllers/university.controller"));
var router = express_1.Router();
router.get('/all', university_controller_1.default.getUniversities);
router.post('/add', university_controller_1.default.addUniversity);
router.post('/addFaculty/:university', university_controller_1.default.addFaculty);
//*******************************KRUNAL**************************************/
//router.post('/addFaculty/:university',passport.authenticate("jwt", { session: false }), universityController.addFaculty);
//*******************************KRUNAL**************************************/
exports.default = router;
//# sourceMappingURL=university.routes.js.map