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
const insignia_1 = __importDefault(require("../models/insignia"));
const getInsignia = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //El await hace que la siguiente linea no se ejecute
    //hasta que el resultado no se haya obtenido
    try {
        const results = yield insignia_1.default.find({});
        return res.status(200).json(results);
    }
    catch (err) {
        return res.status(404).json(err);
    }
});
const getInsignias = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const results = yield insignia_1.default.find({ "user": { "_id": req.body._id } });
        return res.status(200).json(results);
    }
    catch (err) {
        return res.status(404).json(err);
    }
});
const newInsignia = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const insignia = new insignia_1.default({
        "hashtag": req.body.hashtag,
        "requirement": req.body.requirement,
        "date": req.body.date,
        "logo": req.body.logo
    });
    insignia.save().then((data) => {
        return res.status(201).json(data);
    }).catch((err) => {
        return res.status(500).json(err);
    });
});
function updateInsignia(req, res) {
    const id = req.body._id;
    const hashtag = req.params.hashtag;
    const requirement = req.body.requirement;
    const date = req.body.date;
    const logo = req.body.logo;
    insignia_1.default.update({ "_id": id }, { $set: { "hashtag": hashtag, "requirement": requirement, "date": date,
            "logo": logo } }).then((data) => {
        res.status(201).json(data);
    }).catch((err) => {
        res.status(500).json(err);
    });
}
function deleteInsignia(req, res) {
    insignia_1.default.deleteOne({ "_id": req.params._id }).then((data) => {
        res.status(200).json(data);
    }).catch((err) => {
        res.status(500).json(err);
    });
}
exports.default = { getInsignias, getInsignia, newInsignia, updateInsignia, deleteInsignia };
//# sourceMappingURL=insignia.controller.js.map