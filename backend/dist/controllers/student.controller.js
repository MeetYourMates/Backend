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
const student_1 = __importDefault(require("../models/student"));
const getStudents = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const results = yield student_1.default.find({}).populate('users', 'trophies', 'insignias');
        //TODO: Security Risk!!! SENDING PASSWORD OF STUDENTS INSIDE USERS DB
        return res.status(200).json(results);
    }
    catch (err) {
        return res.status(404).json(err);
    }
});
const getStudent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const results = yield student_1.default.find({ "user": { "email": req.body.email } }).populate('users');
        return res.status(200).json(results);
    }
    catch (err) {
        return res.status(404).json(err);
    }
});
const getSubjectsProjects = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const results = yield student_1.default.find({ "user": { "email": req.params.email } })
            .populate({
            path: 'courses',
            model: 'Course',
            populate: [{
                    path: 'subjects',
                    model: 'Subject'
                },
                {
                    path: 'projects',
                    model: 'Project'
                }]
        }).exec();
        return res.status(200).json(results);
    }
    catch (err) {
        return res.status(404).json(err);
    }
});
const addStudent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const student = new student_1.default({
        "name": req.body.name,
        "university": req.body.university,
        "degree": req.body.degree,
        "user": req.body.user,
        "picture": req.body.picture,
        "rating": req.body.punctuation,
        "trophies": req.body.trophies,
        "insignias": req.body.insignias,
        "courses": req.body.courses,
        "chats": req.body.chats
    });
    student.save().then((data) => {
        return res.status(201).json(data);
    }).catch((err) => {
        return res.status(500).json(err);
    });
});
/******************************POL***************************************/
function updateStudentProfile(req, res) {
    console.log(req.body);
    const id = req.body._id;
    const name = req.body.name;
    const user = req.body.user;
    const picture = req.body.picture;
    student_1.default.update({ "_id": id }, { $set: { "name": name, "user": user,
            "picture": picture, } }).then((data) => {
        res.status(201).json(data);
    }).catch((err) => {
        res.status(500).json(err);
    });
}
/***************************************************************************/
function deleteStudent(req, res) {
    student_1.default.deleteOne({ "_id": req.params._id }).then((data) => {
        res.status(200).json(data);
    }).catch((err) => {
        res.status(500).json(err);
    });
}
exports.default = { getStudents, getStudent, addStudent, getSubjectsProjects, updateStudentProfile };
//# sourceMappingURL=student.controller.js.map