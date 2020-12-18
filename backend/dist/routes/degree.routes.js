"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const degree_controller_1 = __importDefault(require("../controllers/degree.controller"));
const router = express_1.Router();
router.get('/get/:degree', degree_controller_1.default.getDegree);
router.post('/add', degree_controller_1.default.addDegree);
router.post('/addSubject', degree_controller_1.default.addSubject);
exports.default = router;
//# sourceMappingURL=degree.routes.js.map