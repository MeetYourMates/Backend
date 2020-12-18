"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const student_controller_1 = __importDefault(require("../controllers/student.controller"));
const router = express_1.Router();
router.get('/all', student_controller_1.default.getStudents);
router.put('/updateStudent', student_controller_1.default.updateStudentProfile);
router.get('/getSubjectsProjects/:email', student_controller_1.default.getSubjectsProjects);
//router.post('/edit', modelController.editModel);
exports.default = router;
//# sourceMappingURL=student.routes.js.map