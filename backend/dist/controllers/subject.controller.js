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
const subject_1 = __importDefault(require("../models/subject"));
const course_1 = __importDefault(require("../models/course"));
const getSubjects = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //El await hace que la siguiente linea no se ejecute
    //hasta que el resultado no se haya obtenido
    try {
        const results = yield subject_1.default.find({});
        console.log(results);
        return res.status(200).json(results);
    }
    catch (err) {
        return res.status(404).json(err);
    }
});
const addSubject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const subject = new subject_1.default({
        "name": req.body.name
    });
    subject.save().then((data) => {
        return res.status(201).json(data);
    }).catch((err) => {
        return res.status(500).json(err);
    });
});
const addCourse = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //Display request
    console.log(req.body);
    //Create a new student entity with the data found in request
    let course = new course_1.default({
        "subject": req.body.subject,
        "name": req.body.name,
        "start": new Date(req.body.start),
        "end": new Date(req.body.end)
    });
    //Look for the student in the database
    let coursedata = yield course_1.default.findOne({ subject: course.subject, start: course.start });
    //If the student is not in the database then save it
    if (!coursedata) {
        yield course.save().then((data) => {
            coursedata = data;
        });
    }
    //Add student to subject
    yield subject_1.default.updateOne({ "_id": course.subject }, { $addToSet: { courses: coursedata === null || coursedata === void 0 ? void 0 : coursedata._id } }).then(result => {
        if (result.nModified == 1) {
            console.log("Course added successfully");
            res.status(201).send({ message: 'Course added successfully' });
        }
        else {
            res.status(409).json('Course was already added!');
        }
    }).catch((err) => {
        console.log("error ", err);
        res.status(500).json(err);
    });
});
exports.default = { addSubject, addCourse, getSubjects };
//# sourceMappingURL=subject.controller.js.map