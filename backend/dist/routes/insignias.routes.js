"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var insignia_controller_1 = __importDefault(require("../controllers/insignia.controller"));
var router = express_1.Router();
router.get('/getAll', insignia_controller_1.default.getInsignias);
router.get('/get/:id', insignia_controller_1.default.getInsignia);
router.put('/AddInsignia', insignia_controller_1.default.newInsignia);
router.post('/EditInsignia', insignia_controller_1.default.updateInsignia);
router.delete('/DeleteInsignia', insignia_controller_1.default.deleteInsignia);
exports.default = router;
//# sourceMappingURL=insignias.routes.js.map