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
var student_1 = __importDefault(require("../models/student"));
var getStudents = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var results, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, student_1.default.find({}).populate('users', 'trophies', 'insignias')];
            case 1:
                results = _a.sent();
                //TODO: Security Risk!!! SENDING PASSWORD OF STUDENTS INSIDE USERS DB
                return [2 /*return*/, res.status(200).json(results)];
            case 2:
                err_1 = _a.sent();
                return [2 /*return*/, res.status(404).json(err_1)];
            case 3: return [2 /*return*/];
        }
    });
}); };
var getStudent = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var results, err_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, student_1.default.find({ "user": { "email": req.body.email } }).populate('users')];
            case 1:
                results = _a.sent();
                return [2 /*return*/, res.status(200).json(results)];
            case 2:
                err_2 = _a.sent();
                return [2 /*return*/, res.status(404).json(err_2)];
            case 3: return [2 /*return*/];
        }
    });
}); };
var getSubjectsProjects = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var results, err_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, student_1.default.find({ "user": { "email": req.params.email } })
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
                    }).exec()];
            case 1:
                results = _a.sent();
                return [2 /*return*/, res.status(200).json(results)];
            case 2:
                err_3 = _a.sent();
                return [2 /*return*/, res.status(404).json(err_3)];
            case 3: return [2 /*return*/];
        }
    });
}); };
var addStudent = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var student;
    return __generator(this, function (_a) {
        student = new student_1.default({
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
        student.save().then(function (data) {
            return res.status(201).json(data);
        }).catch(function (err) {
            return res.status(500).json(err);
        });
        return [2 /*return*/];
    });
}); };
/******************************POL***************************************/
function updateStudentProfile(req, res) {
    console.log(req.body);
    var id = req.body._id;
    var name = req.body.name;
    var user = req.body.user;
    var picture = req.body.picture;
    student_1.default.update({ "_id": id }, { $set: { "name": name, "user": user,
            "picture": picture, } }).then(function (data) {
        res.status(201).json(data);
    }).catch(function (err) {
        res.status(500).json(err);
    });
}
/***************************************************************************/
function deleteStudent(req, res) {
    student_1.default.deleteOne({ "_id": req.params._id }).then(function (data) {
        res.status(200).json(data);
    }).catch(function (err) {
        res.status(500).json(err);
    });
}
exports.default = { getStudents: getStudents, getStudent: getStudent, addStudent: addStudent, getSubjectsProjects: getSubjectsProjects, updateStudentProfile: updateStudentProfile };
//# sourceMappingURL=student.controller.js.map