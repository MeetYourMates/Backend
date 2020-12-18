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
const course_1 = __importDefault(require("../models/course"));
const student_1 = __importDefault(require("../models/student"));
const getCourse = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let course = req.params.subject;
    try {
        const results = yield course_1.default.find({ "_id": course }).populate('students');
        return res.status(200).json(results);
    }
    catch (err) {
        return res.status(404).json(err);
    }
});
const addCourse = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const course = new course_1.default({
        "name": req.body.name,
        "start": new Date(req.body.start),
        "end": new Date(req.body.end)
    });
    course.save().then((data) => {
        return res.status(201).json(data);
    }).catch((err) => {
        return res.status(500).json(err);
    });
});
//Add a course to a student and viceversa!
const addStudent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //Display request
    console.log(req.body);
    if (req.body == null) {
        res.status(400).send({ message: 'Bad Request' });
    }
    if (req.body.subjectId == null || req.body.studentId == null) {
        res.status(400).send({ message: 'Bad Request' });
    }
    //Set variables for the data found in the request body
    let subjectId = req.body.subjectId;
    let studentId = req.body.studentId;
    //Add student to subject
    yield course_1.default.findOne({ subject: [subjectId] }).sort({ start: -1 }).then(course => {
        //No error and we got a result
        console.log("Adding Course to Student: ");
        console.log([course]);
        if (course != null) {
            //We got the course now we search if the student has this course
            //@ts-ignore
            student_1.default.updateOne({ _id: studentId }, { $addToSet: { courses: course._id } }).then(result => {
                if (result.nModified > 0) {
                    res.status(201).send({ message: 'Student Enrolled succesfully!' });
                }
                else {
                    res.status(409).send({ message: 'Student was already Enrolled!' });
                }
            });
        }
        else {
            //No Course Found
            res.status(400).send({ message: 'No Subject in Database' });
        }
    }).catch((err) => {
        console.log("error ", err);
        res.status(500).json({ message: 'Server Error!' });
    });
});
const getCourseStudents = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let course = req.params.course;
    console.log(course);
    try {
        //const results = await Course.find({_id:course}).populate("students");
        const results = yield student_1.default.find({ courses: course });
        return res.status(200).json(results);
    }
    catch (err) {
        console.log(err);
        return res.status(404).json(err);
    }
});
exports.default = { getCourse, addCourse, addStudent, getCourseStudents };
//# sourceMappingURL=course.controller.js.map