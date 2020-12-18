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
const faculty_1 = __importDefault(require("../models/faculty"));
const university_1 = __importDefault(require("../models/university"));
const getUniversities = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //El await hace que la siguiente linea no se ejecute
    //hasta que el resultado no se haya obtenido
    try {
        const results = yield university_1.default.find({})
            .populate({
            path: 'faculties',
            model: 'Faculty',
            populate: {
                path: 'degrees',
                model: 'Degree'
            }
        }).exec();
        console.log(results);
        return res.status(200).json(results);
    }
    catch (err) {
        return res.status(404).json(err);
    }
});
const addUniversity = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const insignia = new university_1.default({
        "name": req.body.name
    });
    insignia.save().then((data) => {
        return res.status(201).json(data);
    }).catch((err) => {
        return res.status(500).json(err);
    });
});
const addFaculty = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //Display request
    console.log(req.body);
    //Set variables for the data found in the request body
    let university = req.params.university;
    //Create a new student entity with the data found in request
    let faculty = new faculty_1.default({
        "name": req.body.name
    });
    //Look for the Faculty in the database
    let facultydata = yield faculty_1.default.findOne({ name: faculty.name });
    //If the student is not in the database then save it
    if (!facultydata) {
        yield faculty.save().then((data) => {
            facultydata = data;
        });
    }
    //Add student to subject
    //@ts-ignore
    yield university_1.default.updateOne({ "name": university }, { $addToSet: { faculties: facultydata === null || facultydata === void 0 ? void 0 : facultydata._id } }).then(result => {
        if (result.nModified == 1) {
            console.log("Faculty added successfully");
            res.status(201).send({ message: 'Faculty added successfully' });
        }
        else {
            res.status(409).json('Faculty was already added!');
        }
    }).catch((err) => {
        console.log("error ", err);
        res.status(500).json(err);
    });
});
exports.default = { getUniversities, addUniversity, addFaculty };
//# sourceMappingURL=university.controller.js.map