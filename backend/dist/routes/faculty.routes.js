"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const faculty_controller_1 = __importDefault(require("../controllers/faculty.controller"));
const router = express_1.Router();
router.post('/add', faculty_controller_1.default.addFaculty);
router.post('/addDegree', faculty_controller_1.default.addDegree);
exports.default = router;
//# sourceMappingURL=faculty.routes.js.map