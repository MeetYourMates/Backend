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
const degree_1 = __importDefault(require("../models/degree"));
const subject_1 = __importDefault(require("../models/subject"));
const getDegree = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //El await hace que la siguiente linea no se ejecute
    //hasta que el resultado no se haya obtenido
    let degree = req.params.degree;
    console.log(degree);
    try {
        const results = yield degree_1.default.find({ "_id": degree }).populate({
            path: 'subjects',
            model: 'Subject'
        }).exec();
        console.log(results);
        return res.status(200).json(results[0]);
    }
    catch (err) {
        return res.status(404).json(err);
    }
});
const addDegree = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const degree = new degree_1.default({
        "name": req.body.name
    });
    degree.save().then((data) => {
        return res.status(201).json(data);
    }).catch((err) => {
        return res.status(500).json(err);
    });
});
//Adds a subject to a degree
const addSubject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //Display request
    console.log(req.body);
    //Set variables for the data found in the request body
    let degree = req.body.degree;
    //Create a new student entity with the data found in request
    let subject = new subject_1.default({
        "name": req.body.name,
        "start": new Date(req.body.start),
        "end": new Date(req.body.start)
    });
    //Look for the student in the database
    let subjectdata = yield subject_1.default.findOne({ name: subject.name });
    //If the student is not in the database then save it
    if (!subjectdata) {
        yield subject.save().then((data) => {
            subjectdata = data;
        });
    }
    //Add student to subject
    //@ts-ignore
    yield degree_1.default.updateOne({ "_id": degree }, { $addToSet: { subjects: subjectdata === null || subjectdata === void 0 ? void 0 : subjectdata._id } }).then(result => {
        if (result.nModified == 1) {
            console.log("Subject added successfully");
            res.status(201).send({ message: 'Subject added successfully' });
        }
        else {
            res.status(409).json('Subject was already added!');
        }
    }).catch((err) => {
        console.log("error ", err);
        res.status(500).json(err);
    });
});
exports.default = { getDegree, addDegree, addSubject };
//# sourceMappingURL=degree.controller.js.map