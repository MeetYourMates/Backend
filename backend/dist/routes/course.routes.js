"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var course_controller_1 = __importDefault(require("../controllers/course.controller"));
var router = express_1.Router();
router.post('/get', course_controller_1.default.getCourse);
router.post('/add', course_controller_1.default.addCourse);
router.post('/addStudent', course_controller_1.default.addStudent);
router.get('/getStudents/:course', course_controller_1.default.getCourseStudents);
exports.default = router;
//# sourceMappingURL=course.routes.js.map