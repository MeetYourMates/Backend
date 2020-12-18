"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const trophy_1 = __importDefault(require("../models/trophy"));
const getTrophies = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //El await hace que la siguiente linea no se ejecute
    //hasta que el resultado no se haya obtenido
    try {
        const results = yield trophy_1.default.find({ "_id": req.body._id });
        return res.status(200).json(results);
    }
    catch (err) {
        return res.status(404).json(err);
    }
});
const getTrophy = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const results = yield trophy_1.default.find({ "_id": req.body._id });
        return res.status(200).json(results);
    }
    catch (err) {
        return res.status(404).json(err);
    }
});
const newTrophy = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const trophy = new trophy_1.default({
        "title": req.body.title,
        "difficulty": req.body.difficulty,
        "professor": req.body.professor,
        "date": req.body.date,
        "logo": req.body.logo
    });
    trophy.save().then((data) => {
        return res.status(201).json(data);
    }).catch((err) => {
        return res.status(500).json(err);
    });
});
function updateTrophy(req, res) {
    const id = req.body._id;
    const title = req.params.title;
    const difficulty = req.body.difficulty;
    const professor = req.body.professor;
    const date = req.body.date;
    const logo = req.body.logo;
    trophy_1.default.update({ "_id": id }, { $set: { "title": title, "difficulty": difficulty, "professor": professor, "date": date,
            "logo": logo } }).then((data) => {
        res.status(201).json(data);
    }).catch((err) => {
        res.status(500).json(err);
    });
}
function deleteTrophy(req, res) {
    trophy_1.default.deleteOne({ "_id": req.params._id }).then((data) => {
        res.status(200).json(data);
    }).catch((err) => {
        res.status(500).json(err);
    });
}
exports.default = { getTrophies, getTrophy, newTrophy, updateTrophy, deleteTrophy };
//# sourceMappingURL=trophy.controller.js.map