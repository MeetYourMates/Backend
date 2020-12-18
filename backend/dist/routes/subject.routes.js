"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const subject_controller_1 = __importDefault(require("../controllers/subject.controller"));
const router = express_1.Router();
router.get('/get', subject_controller_1.default.getSubjects);
router.post('/add', subject_controller_1.default.addSubject);
router.post('/addCourse', subject_controller_1.default.addCourse);
exports.default = router;
//# sourceMappingURL=subject.routes.js.map