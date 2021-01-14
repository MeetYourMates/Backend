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
var subject_1 = __importDefault(require("../models/subject"));
var user_1 = __importDefault(require("../models/user"));
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
/******************************MAITE***************************************/
var getSubjectsProjects = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var results, result, _i, result_1, course, subject, err_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 6, , 7]);
                return [4 /*yield*/, student_1.default.find({ _id: req.params.id }).select('courses').populate({
                        path: 'courses',
                        select: 'subject projects',
                        populate: {
                            path: 'projects',
                            model: 'Project'
                        }
                    }).lean()];
            case 1:
                results = _a.sent();
                result = results[0]['courses'];
                _i = 0, result_1 = result;
                _a.label = 2;
            case 2:
                if (!(_i < result_1.length)) return [3 /*break*/, 5];
                course = result_1[_i];
                return [4 /*yield*/, subject_1.default.find({ _id: course['subject'] })];
            case 3:
                subject = _a.sent();
                course['subjectName'] = subject[0]['name'];
                //Limpia los campos que no interesan
                delete course['subject'];
                _a.label = 4;
            case 4:
                _i++;
                return [3 /*break*/, 2];
            case 5:
                console.log(results);
                return [2 /*return*/, res.status(200).json(result)];
            case 6:
                err_3 = _a.sent();
                console.log(err_3);
                return [2 /*return*/, res.status(404).json(err_3)];
            case 7: return [2 /*return*/];
        }
    });
}); };
/***************************************************************************/
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
    //Only Updates Name and  Picture
    user_1.default.findByIdAndUpdate({ "_id": req.body.user._id }, { $set: { "name": req.body.user.name, "picture": req.body.user.picture } }).then(function (data) {
        if (data == null)
            return res.status(400).json(req.body);
        student_1.default.findByIdAndUpdate({ "_id": req.body._id }, { $set: { "ratings": req.body.ratings, "trophies": req.body.trophies, "insignias": req.body.insignias } }, {
            new: true
        }).then(function (resultStudent) {
            if (resultStudent == null) {
                return res.status(400).json(req.body);
            }
            console.log("***************************************");
            console.log(resultStudent);
            res.status(200).json(req.body);
        });
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
/******************************PEP***************************************/
var getStudentCourses = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var results, err_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, student_1.default.find({ _id: req.params.id }).select('courses').populate('courses').lean()];
            case 1:
                results = _a.sent();
                results = results[0]['courses'];
                return [2 /*return*/, res.status(200).json(results)]; //Ignoro vector student y me meto directamente en los courses, así ahorro complicaciones en el frontend
            case 2:
                err_4 = _a.sent();
                console.log(err_4);
                return [2 /*return*/, res.status(404).json(err_4)];
            case 3: return [2 /*return*/];
        }
    });
}); };
/************************************************************************/
/******************************PEP***************************************/
/*

Devuelve lista de Course de un Student, con información básica de los Student que hay en cada Course
y con el nombre del Subject al que pertenece cada Course. Esta petición está diseñada para el search_mates,
que muestra toda esta información en una misma pantalla. Como manejar consultas asincronas a tres modelos
diferentes nos complica mucho el Frontend, creamos esta consulta que contenga todo lo necesario.
En el Frontend se recogerá dentro de un un objeto AdHoc, diseñado específicamente para search_mates.

Estructura del resultado:

[
    {
        '_id',
        'start',
        'end',
        'students': [
            {
                '_id',
                'name',
                'picture'
            }
        ],
        'subjectName'
    }
]

*/
var getStudentsAndCourses = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var result, myId, results, _i, results_1, course, subject, filter, students, err_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 7, , 8]);
                //Busca los cursos del Student por su id
                //El metodo lean() nos permite modificar el objecto en el próximo bucle, para poder enviar info extra.
                if (req.params.id == null) {
                    return [2 /*return*/, res.status(400).json("{'error':'Bad Request'}")];
                }
                return [4 /*yield*/, student_1.default.findOne({ _id: req.params.id }).select('courses user').populate({
                        path: 'courses',
                        select: 'start end students subject',
                    }).lean()];
            case 1:
                result = _a.sent();
                myId = result['user'].toString();
                results = result['courses'];
                _i = 0, results_1 = results;
                _a.label = 2;
            case 2:
                if (!(_i < results_1.length)) return [3 /*break*/, 6];
                course = results_1[_i];
                return [4 /*yield*/, subject_1.default.find({ _id: course['subject'] })];
            case 3:
                subject = _a.sent();
                course['subjectName'] = subject[0]['name'];
                //Limpia los campos que no interesan
                delete course['subject'];
                filter = { $and: [{ courses: course['_id'] }, { "user": { $ne: myId } }] };
                return [4 /*yield*/, student_1.default.find(filter).select('user degree university').populate('ratings').populate('trophies').populate('insignias').populate({
                        path: 'user',
                        model: 'User',
                        select: 'picture name email'
                    })];
            case 4:
                students = _a.sent();
                course['students'] = students;
                _a.label = 5;
            case 5:
                _i++;
                return [3 /*break*/, 2];
            case 6: 
            //console.debug(results);
            return [2 /*return*/, res.status(200).json(results)];
            case 7:
                err_5 = _a.sent();
                console.log(err_5);
                return [2 /*return*/, res.status(404).json(err_5)];
            case 8: return [2 /*return*/];
        }
    });
}); };
/************************************************************************/
exports.default = { getStudents: getStudents, getStudent: getStudent, addStudent: addStudent, getSubjectsProjects: getSubjectsProjects, updateStudentProfile: updateStudentProfile, getStudentCourses: getStudentCourses, getStudentsAndCourses: getStudentsAndCourses };
//# sourceMappingURL=student.controller.js.map