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
const faculty_1 = __importDefault(require("../models/faculty"));
const addFaculty = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const faculty = new faculty_1.default({
        "name": req.body.name
    });
    faculty.save().then((data) => {
        return res.status(201).json(data);
    }).catch((err) => {
        return res.status(500).json(err);
    });
});
const addDegree = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //Display request
    console.log(req.body);
    //Set variables for the data found in the request body
    let faculty = req.body.faculty;
    //Create a new student entity with the data found in request
    let degree = new degree_1.default({
        "name": req.body.name
    });
    //Look for the student in the database
    let degreedata = yield degree_1.default.findOne({ name: degree.name });
    //If the student is not in the database then save it
    if (!degreedata) {
        yield degree.save().then((data) => {
            degreedata = data;
        });
    }
    //Add student to subject
    //@ts-ignore
    yield faculty_1.default.updateOne({ "_id": faculty }, { $addToSet: { degrees: degreedata === null || degreedata === void 0 ? void 0 : degreedata._id } }).then(result => {
        if (result.nModified == 1) {
            console.log("Degree added successfully");
            res.status(201).send({ message: 'Degree added successfully' });
        }
        else {
            res.status(409).json('Degree was already added!');
        }
    }).catch((err) => {
        console.log("error ", err);
        res.status(500).json(err);
    });
});
exports.default = { addFaculty, addDegree };
//# sourceMappingURL=faculty.controller.js.map