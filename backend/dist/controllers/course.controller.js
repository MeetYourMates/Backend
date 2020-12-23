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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var course_1 = __importDefault(require("../models/course"));
var student_1 = __importDefault(require("../models/student"));
var getCourse = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var course, results, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                course = req.params.subject;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, course_1.default.find({ "_id": course }).populate('students')];
            case 2:
                results = _a.sent();
                return [2 /*return*/, res.status(200).json(results)];
            case 3:
                err_1 = _a.sent();
                return [2 /*return*/, res.status(404).json(err_1)];
            case 4: return [2 /*return*/];
        }
    });
}); };
var addCourse = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var course;
    return __generator(this, function (_a) {
        course = new course_1.default({
            "name": req.body.name,
            "start": new Date(req.body.start),
            "end": new Date(req.body.end)
        });
        course.save().then(function (data) {
            return res.status(201).json(data);
        }).catch(function (err) {
            return res.status(500).json(err);
        });
        return [2 /*return*/];
    });
}); };
//Add a course to a student and viceversa!
var addStudent = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var subjectId, studentId;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                //Display request
                console.log(req.body);
                if (req.body == null) {
                    res.status(400).send({ message: 'Bad Request' });
                }
                if (req.body.subjectId == null || req.body.studentId == null) {
                    res.status(400).send({ message: 'Bad Request' });
                }
                subjectId = req.body.subjectId;
                studentId = req.body.studentId;
                //Add student to subject
                return [4 /*yield*/, course_1.default.findOne({ subject: [subjectId] }).sort({ start: -1 }).then(function (course) {
                        //No error and we got a result
                        console.log("Adding Course to Student: ");
                        console.log([course]);
                        if (course != null) {
                            //We got the course now we search if the student has this course
                            //@ts-ignore
                            student_1.default.updateOne({ _id: studentId }, { $addToSet: { courses: course._id } }).then(function (result) {
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
                    }).catch(function (err) {
                        console.log("error ", err);
                        res.status(500).json({ message: 'Server Error!' });
                    })];
            case 1:
                //Add student to subject
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
var getCourseStudents = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var course, results, err_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                course = req.params.course;
                console.log(course);
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, student_1.default.find({ courses: course }).populate('user')];
            case 2:
                results = _a.sent();
                return [2 /*return*/, res.status(200).json(results)];
            case 3:
                err_2 = _a.sent();
                console.log(err_2);
                return [2 /*return*/, res.status(404).json(err_2)];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.default = { getCourse: getCourse, addCourse: addCourse, addStudent: addStudent, getCourseStudents: getCourseStudents };
//# sourceMappingURL=course.controller.js.map