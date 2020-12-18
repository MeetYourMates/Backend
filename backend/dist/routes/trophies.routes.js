"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const trophy_controller_1 = __importDefault(require("../controllers/trophy.controller"));
const router = express_1.Router();
router.get('/getAll', trophy_controller_1.default.getTrophies);
router.get('/get/:id', trophy_controller_1.default.getTrophy);
router.put('/AddTrophy', trophy_controller_1.default.newTrophy);
router.post('/EditTrophy', trophy_controller_1.default.updateTrophy);
router.delete('/DeleteTrophy', trophy_controller_1.default.deleteTrophy);
exports.default = router;
//# sourceMappingURL=trophies.routes.js.map