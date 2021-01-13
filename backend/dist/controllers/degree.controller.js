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
var degree_1 = __importDefault(require("../models/degree"));
var subject_1 = __importDefault(require("../models/subject"));
var getDegree = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var degree, results, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                degree = req.params.degree;
                console.log(degree);
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, degree_1.default.find({ "_id": degree }).populate({
                        path: 'subjects',
                        model: 'Subject'
                    }).exec()];
            case 2:
                results = _a.sent();
                console.log(results);
                return [2 /*return*/, res.status(200).json(results[0])];
            case 3:
                err_1 = _a.sent();
                return [2 /*return*/, res.status(404).json(err_1)];
            case 4: return [2 /*return*/];
        }
    });
}); };
var addDegree = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var degree;
    return __generator(this, function (_a) {
        degree = new degree_1.default({
            "name": req.body.name
        });
        degree.save().then(function (data) {
            return res.status(201).json(data);
        }).catch(function (err) {
            return res.status(500).json(err);
        });
        return [2 /*return*/];
    });
}); };
//Adds a subject to a degree
var addSubject = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var degree, subject, subjectdata;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                //Display request
                console.log(req.body);
                degree = req.body.degree;
                subject = new subject_1.default({
                    "name": req.body.name,
                    "start": new Date(req.body.start),
                    "end": new Date(req.body.start)
                });
                return [4 /*yield*/, subject_1.default.findOne({ name: subject.name })
                    //If the student is not in the database then save it
                ];
            case 1:
                subjectdata = _a.sent();
                if (!!subjectdata) return [3 /*break*/, 3];
                return [4 /*yield*/, subject.save().then(function (data) {
                        subjectdata = data;
                    })];
            case 2:
                _a.sent();
                _a.label = 3;
            case 3: 
            //Add student to subject
            //@ts-ignore
            return [4 /*yield*/, degree_1.default.updateOne({ "_id": degree }, { $addToSet: { subjects: subjectdata === null || subjectdata === void 0 ? void 0 : subjectdata._id } }).then(function (result) {
                    if (result.nModified == 1) {
                        console.log("Subject added successfully");
                        res.status(201).send({ message: 'Subject added successfully' });
                    }
                    else {
                        res.status(409).json('Subject was already added!');
                    }
                }).catch(function (err) {
                    console.log("error ", err);
                    res.status(500).json(err);
                })];
            case 4:
                //Add student to subject
                //@ts-ignore
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
exports.default = { getDegree: getDegree, addDegree: addDegree, addSubject: addSubject };
//# sourceMappingURL=degree.controller.js.map