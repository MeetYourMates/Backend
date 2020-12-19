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
const project_1 = __importDefault(require("../models/project"));
/**======================
 *    addProject
 *========================**/
const addProject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //Display request
    console.log(req.body);
    if (req.body == null) {
        res.status(400).send({ message: 'Bad Request' });
    }
    if (req.body.subjectId == null || req.body.ProjectId == null) {
        res.status(400).send({ message: 'Bad Request' });
    }
    //Set variables for the data found in the request body
    let subjectId = req.body.subjectId;
    const project = new project_1.default({
        "name": req.body.name,
        "teamNames": req.body.teamNames,
        "numberStudents": req.body.numberStudents,
        "hashtags": req.body.hashtags,
        "teams": req.body.teams
    });
    yield project.save().then((data) => {
        //Add Project to subject
        course_1.default.findOne({ subject: [subjectId] }).sort({ start: -1 }).then(course => {
            //No error and we got a result
            console.log("Adding Course to Project: ");
            console.log([course]);
            if (course != null) {
                //We got the course now we search if the Project has this course 
                //@ts-ignore
                course_1.default.updateOne({ "_id": course === null || course === void 0 ? void 0 : course._id }, { $addToSet: { projects: data._id } }).then(result => {
                    if (result.nModified > 0) {
                        res.status(201).send({ message: 'Project Enrolled succesfully!' });
                    }
                    else {
                        res.status(409).send({ message: 'Project was already Enrolled!' });
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
});
exports.default = { addProject };
//# sourceMappingURL=project.controller.js.map