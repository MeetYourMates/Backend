"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var student_controller_1 = __importDefault(require("../controllers/student.controller"));
var router = express_1.Router();
router.get('/all', student_controller_1.default.getStudents);
router.put('/updateStudent', student_controller_1.default.updateStudentProfile);
router.get('/getSubjectsProjects/:email', student_controller_1.default.getSubjectsProjects);
router.get('/getStudentCourses/:id', student_controller_1.default.getStudentCourses);
router.get('/getStudentsAndCourses/:id', student_controller_1.default.getStudentsAndCourses);
router.get('/getStudentProjects/:id', student_controller_1.default.getSubjectsProjects);
//router.post('/edit', modelController.editModel);
exports.default = router;
//# sourceMappingURL=student.routes.js.map