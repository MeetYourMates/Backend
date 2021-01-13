"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var faculty_controller_1 = __importDefault(require("../controllers/faculty.controller"));
var router = express_1.Router();
router.post('/add', faculty_controller_1.default.addFaculty);
router.post('/addDegree', faculty_controller_1.default.addDegree);
exports.default = router;
//# sourceMappingURL=faculty.routes.js.map