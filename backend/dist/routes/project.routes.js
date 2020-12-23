"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var project_controller_1 = __importDefault(require("../controllers/project.controller"));
//! Not Uploaded to GitHub!! 
var router = express_1.Router();
router.post('/add', project_controller_1.default.addProject);
//! Not getting Uploaded 
//! Not getting Uploaded 
exports.default = router;
//# sourceMappingURL=project.routes.js.map