"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const project_controller_1 = __importDefault(require("../controllers/project.controller"));
const router = express_1.Router();
router.post('/add', project_controller_1.default.addProject);
exports.default = router;
//# sourceMappingURL=project.routes.js.map