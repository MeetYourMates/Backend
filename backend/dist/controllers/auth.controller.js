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
var nodemailer_1 = require("nodemailer");
var randomstring_1 = require("randomstring");
var custom_models_helper_1 = __importDefault(require("../helpers/custom_models_helper"));
var jwt_1 = __importDefault(require("../helpers/jwt"));
var professor_1 = __importDefault(require("../models/professor"));
var recovery_1 = __importDefault(require("../models/recovery"));
var student_1 = __importDefault(require("../models/student"));
var user_1 = __importDefault(require("../models/user"));
var validation_1 = __importDefault(require("../models/validation"));
var config_1 = __importDefault(require("../config/config"));
var path = require('path');
var Bcrypt = require("bcryptjs");
var _a = require('express-validator'), body = _a.body, validationResult = _a.validationResult;
var sendEmail = function (receiver, code) { return __awaiter(void 0, void 0, void 0, function () {
    var transporter, message, mailOptions;
    return __generator(this, function (_a) {
        transporter = nodemailer_1.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            requireTLS: true,
            auth: {
                user: 'meetyourmatesprueba@gmail.com',
                pass: 'hztmdbzaopsgtnal'
            }
        });
        message = "<h1>Welcome to Meet your Mates!</h1><p>To activate your account, use the next link: <a href='http://localhost:3000/auth/validate/" + code + "'>Activate</a> Or introduce the next code in the app: </p><h3>" + code + "</h3>";
        mailOptions = {
            from: 'meetyourmatesprueba@gmail.com',
            to: receiver,
            subject: "Welcome to Meet Your Mates!",
            text: "Welcome to Meet your Mates! To activate your account, use the next link: http://localhost:3000/auth/validate/" + code + " Or introduce the next code in the app: " + code,
            html: message
        };
        transporter.sendMail(mailOptions, function (error) {
            if (error) {
                console.log(error);
            }
        });
        return [2 /*return*/];
    });
}); };
var registerUser = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var saltRounds, newUser_1;
    return __generator(this, function (_a) {
        try {
            saltRounds = 10;
            newUser_1 = new user_1.default({
                "password": Bcrypt.hashSync(req.body.password, saltRounds),
                "email": req.body.email.toLowerCase(),
                "name": req.body.name,
                "picture": "https://res.cloudinary.com/meetyourmatesapi/image/upload/v1608740748/users/585e4bf3cb11b227491c339a_caeqr6.png",
                "validated": false
            });
            user_1.default.findOne({ "email": newUser_1.email }).then(function (s) {
                if (s == null) {
                    newUser_1.save().then(function (data) {
                        newUser_1 = data;
                    });
                    var validation_2 = new validation_1.default({
                        "code": randomstring_1.generate(7),
                        "user": newUser_1,
                        "date": Date.now(),
                    });
                    validation_2.save().then(function () {
                        sendEmail(newUser_1.email, validation_2.code);
                        return res.status(201).json({ "message": "User registered",
                            "code": validation_2.code });
                    });
                }
                else if (!s.validated) {
                    //Not Validated Than delete the current user
                    user_1.default.deleteOne({ "email": newUser_1.email }).then(function () {
                        newUser_1.save().then(function (data) {
                            newUser_1 = data;
                            var validation = new validation_1.default({
                                "code": randomstring_1.generate(7),
                                "user": newUser_1,
                                "date": Date.now(),
                            });
                            validation.save().then(function () {
                                sendEmail(newUser_1.email, validation.code);
                                return res.status(201).json({ "message": "User registered",
                                    "code": validation.code });
                            });
                        });
                    });
                }
                else {
                    //User Exists and is Validated!
                    return res.status(409).json("User already exists");
                }
            });
        }
        catch (err) {
            console.log(err);
            return [2 /*return*/, res.status(500)];
        }
        return [2 /*return*/];
    });
}); };
//Login User and returns Student
var accessUser = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var errors, filter;
    return __generator(this, function (_a) {
        errors = validationResult(req);
        if (!errors.isEmpty()) {
            return [2 /*return*/, res.status(400).json({ errors: errors.array() })];
        }
        try {
            console.log("Request Body: ", req.body);
            filter = { 'email': req.body.email };
            console.log("Filter Query SignIn", filter);
            user_1.default.findOne(filter).then(function (resultUser) { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    //I have _id, email, password
                    if (resultUser != null) {
                        console.log("email: " + resultUser.email);
                        if (Bcrypt.compareSync(req.body.password, resultUser.password)) {
                            resultUser.password = "password-hidden";
                            //Check if Student Email
                            if (!resultUser.email.includes('estudiantat')) {
                                //Its actually a user of professor
                                professor_1.default.findOne({ "user": resultUser._id }).then(function (resProfessor) {
                                    //Professor
                                    if (resProfessor == null) {
                                        //* NOT VALIDATED
                                        var userWithoutToken = new user_1.default({
                                            "_id": resultUser._id,
                                            "password": "password-hidden",
                                            "email": resultUser.email,
                                            "name": resultUser.name,
                                            "picture": resultUser.picture,
                                            "validated": false,
                                            "token": "Not-Authorized"
                                        });
                                        //const professorNotValidated: { "user": IUser } = {"user": userWithoutToken};
                                        console.log("Line87:Login--> Professor hasn't Validated: " + userWithoutToken);
                                        return res.status(203).json(userWithoutToken);
                                    }
                                    else {
                                        //* Validated
                                        professor_1.default.findOne({ 'user': resultUser._id }).populate('user').lean().then(function (result) {
                                            /**==============================================
                                             **      Validated & Completed Lets Get Started
                                             *===============================================**/
                                            if (result.courses.length > 0) {
                                                var userWithToken = {
                                                    "_id": result.user._id.toString(),
                                                    "password": "password-hidden",
                                                    "email": result.user.email,
                                                    "name": result.user.name,
                                                    "picture": result.user.picture,
                                                    "validated": true,
                                                    "token": jwt_1.default.createToken(resultUser)
                                                };
                                                //const result2 = customHelper.getCustomProfessor(result, userWithToken);
                                                result['user'] = userWithToken;
                                                //Validated and Has courses than student can login!
                                                console.log("Login--> Professor Validated Result: " + result);
                                                return res.status(200).json(result);
                                            }
                                            else {
                                                //Student --> user --> token
                                                //token: createToken(user)
                                                var userWithToken = {
                                                    "_id": result.user._id,
                                                    "password": "password-hidden",
                                                    "email": result.user.email,
                                                    "name": result.user.name,
                                                    "picture": result.user.picture,
                                                    "validated": true,
                                                    "token": jwt_1.default.createToken(result.user)
                                                };
                                                //Newly custom created user has now token in the json!
                                                result['user'] = userWithToken;
                                                console.log("Login--> professor Not Enrolled Result: " + result);
                                                return res.status(206).json(result);
                                            }
                                        });
                                    }
                                });
                            }
                            else {
                                student_1.default.findOne({ "user": resultUser._id }).then(function (resStudent) {
                                    if (resStudent == null) {
                                        //* NOT VALIDATED
                                        var userWithoutToken = new user_1.default({
                                            "_id": resultUser._id,
                                            "password": "password-hidden",
                                            "email": resultUser.email,
                                            "name": resultUser.name,
                                            "picture": resultUser.picture,
                                            "validated": false,
                                            "token": "Not-Authorized"
                                        });
                                        //const studentNotValidated: { "user": IUser } = {"user": userWithoutToken};
                                        console.log("Line87:Login--> student hasn't Validated: " + userWithoutToken);
                                        return res.status(203).json(userWithoutToken);
                                    }
                                    else {
                                        //* Validated
                                        student_1.default.findOne({ 'user': resultUser._id }).populate('user').populate('ratings').populate('trophies').populate('insignias').then(function (result) {
                                            /**==============================================
                                             **      Validated & Completed Lets Get Started
                                             *===============================================**/
                                            if (result.courses.length > 0) {
                                                var userWithToken = {
                                                    "_id": result.user._id,
                                                    "password": "password-hidden",
                                                    "email": result.user.email,
                                                    "name": result.user.name,
                                                    "picture": result.user.picture,
                                                    "validated": true,
                                                    "token": jwt_1.default.createToken(result.user)
                                                };
                                                var result2 = custom_models_helper_1.default.getCustomStudent(result, userWithToken);
                                                //Validated and Has courses than student can login!
                                                console.log("Login--> student Validated Result: " + result2);
                                                return res.status(200).json(result2);
                                            }
                                            else {
                                                //Student --> user --> token
                                                //token: createToken(user)
                                                var userWithToken = {
                                                    "_id": result.user._id,
                                                    "password": "password-hidden",
                                                    "email": result.user.email,
                                                    "name": result.user.name,
                                                    "picture": result.user.picture,
                                                    "validated": true,
                                                    "token": jwt_1.default.createToken(result.user)
                                                };
                                                //Newly custom created user has now token in the json!
                                                var result2 = custom_models_helper_1.default.getCustomStudent(result, userWithToken);
                                                console.log("Login--> student Not Enrolled Result: " + result2);
                                                return res.status(206).json(result2);
                                            }
                                        });
                                    }
                                });
                            }
                        }
                        else {
                            return [2 /*return*/, res.status(404).json({ 'error': 'User Password Incorrect!' })];
                        }
                    }
                    else {
                        return [2 /*return*/, res.status(404).json({ 'error': 'User Not Found!' })];
                    }
                    return [2 /*return*/];
                });
            }); });
        }
        catch (err) {
            console.log(err);
            return [2 /*return*/, res.status(500).json(err)];
        }
        return [2 /*return*/];
    });
}); };
var sendEmailRecovery = function (receiver, code) { return __awaiter(void 0, void 0, void 0, function () {
    var transporter, message, mailOptions;
    return __generator(this, function (_a) {
        transporter = nodemailer_1.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            requireTLS: true,
            auth: {
                user: 'meetyourmatesprueba@gmail.com',
                pass: 'hztmdbzaopsgtnal'
            }
        });
        message = "<h1>MYM - Reset Password</h1><p>Need to Reset the password? Just type this code in the app, If you did not make the request, please ignore this email.</p><h3>" + code + "</h3>";
        mailOptions = {
            from: 'meetyourmatesprueba@gmail.com',
            to: receiver,
            subject: "Meet Your Mates - Password Reset Request",
            text: "Need to Reset the password? Just type this code in the app: " + code + " ,If you did not make the request, please ignore this email.",
            html: message
        };
        transporter.sendMail(mailOptions, function (error) {
            if (error) {
                console.log(error);
            }
        });
        return [2 /*return*/];
    });
}); };
var forgotPassword = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var email, s, dateCode, timeElapsed, recovery_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (req.params.email == null) {
                    return [2 /*return*/, res.status(400).json({ "message": "Bad Request, data requiered" })];
                }
                email = req.params.email;
                //let s = await Validation.findOne({"code": code});
                console.log({ email: email });
                return [4 /*yield*/, user_1.default.findOne({ "email": email })];
            case 1:
                s = _a.sent();
                if (s) {
                    dateCode = Date.parse(s.lastActiveAt.toString());
                    timeElapsed = (Date.now() - dateCode) / (1000 * 60 * 60);
                    if (timeElapsed > config_1.default.expirationTime) {
                        return [2 /*return*/, res.status(405).json({ "message": "Code Expired" })];
                    }
                    recovery_2 = new recovery_1.default({
                        "code": randomstring_1.generate(7),
                        "email": email
                    });
                    recovery_2.save().then(function () {
                        sendEmailRecovery(email, recovery_2.code);
                        return res.status(201).json({ "message": "Email Sent" });
                    });
                }
                else {
                    //User doesnt Exist
                    return [2 /*return*/, res.status(404).json({ "message": "No User Found" })];
                }
                return [2 /*return*/];
        }
    });
}); };
var changePassword = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var errors, saltRounds, filter, s;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                errors = validationResult(req);
                if (!errors.isEmpty()) {
                    return [2 /*return*/, res.status(400).json({ errors: errors.array() })];
                }
                //let code = req.params.code;
                //Request.body = {"email":email,"code":code,"password":newPassword};
                if (req.body.email == null || req.body.code == null || req.body.password == null) {
                    return [2 /*return*/, res.status(400).json({ "message": "Bad Request, data requiered" })];
                }
                else if (req.body.password.length < 3) {
                    return [2 /*return*/, res.status(400).json({ "message": "Password min length 3" })];
                }
                saltRounds = 10;
                filter = { 'code': req.body.code, 'email': req.body.email };
                return [4 /*yield*/, recovery_1.default.findOne(filter)];
            case 1:
                s = _a.sent();
                if (!(s != null)) return [3 /*break*/, 3];
                //let user = await User.findOne({"_id": s.user._id})
                return [4 /*yield*/, user_1.default.updateOne({ "email": req.body.email }, { "password": Bcrypt.hashSync(req.body.password, saltRounds) }).then(function () {
                        // @ts-ignore
                        s.deleteOne();
                        return res.status(200).json({ "message": "Sucessfully Changed Password" });
                    })];
            case 2:
                //let user = await User.findOne({"_id": s.user._id})
                _a.sent();
                return [3 /*break*/, 4];
            case 3: return [2 /*return*/, res.status(500).json({ "message": "Code or Email Incorrect" })];
            case 4: return [2 /*return*/];
        }
    });
}); };
//Validates User
var validateUser = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var code, s, dateCode, timeElapsed, user_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                code = req.params.code;
                console.log("Validation Code: ", code);
                return [4 /*yield*/, validation_1.default.findOne({ "code": code })];
            case 1:
                s = _a.sent();
                console.log("Validation Mongodb user found: ", s);
                if (!(s != null)) return [3 /*break*/, 6];
                dateCode = Date.parse(s.date.toString());
                timeElapsed = (Date.now() - dateCode) / (1000 * 60 * 60);
                if (timeElapsed > config_1.default.expirationTime) {
                    return [2 /*return*/, res.status(405).json({ "message": "Code Expired" })];
                }
                return [4 /*yield*/, user_1.default.findOne({ "_id": s.user._id })];
            case 2:
                user_2 = _a.sent();
                if (!(user_2 != null)) return [3 /*break*/, 4];
                return [4 /*yield*/, user_1.default.updateOne({ "_id": user_2._id }, { "validated": true }).then(function () {
                        // @ts-ignore
                        s.deleteOne();
                        //Create New Student
                        var extension = user_2.email.split("@");
                        if (extension[1] == "estudiantat.upc.edu") {
                            var student = new student_1.default({
                                "user": user_2 === null || user_2 === void 0 ? void 0 : user_2._id
                            });
                            student.save();
                            return res.status(201).sendFile(path.join(__dirname, "../public", '/views', '/confirmed.html'));
                        }
                        else if (extension[1] == "upc.edu" || extension[1] == "entel.upc.edu") {
                            var professor = new professor_1.default({
                                "user": user_2 === null || user_2 === void 0 ? void 0 : user_2._id
                            });
                            professor.save();
                            return res.status(201).sendFile(path.join(__dirname, "../public", '/views', '/confirmed.html'));
                        }
                        else {
                            return res.status(405).json({ "message": "Invalid email form" });
                        }
                    })];
            case 3:
                _a.sent();
                return [3 /*break*/, 5];
            case 4: return [2 /*return*/, res.status(500)];
            case 5: return [3 /*break*/, 7];
            case 6: return [2 /*return*/, res.status(404).json({ "message": "Code Incorrect" })];
            case 7: return [2 /*return*/];
        }
    });
}); };
var registerUserbyGoogle = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var saltRounds, newUser, newStudent, s;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                saltRounds = 10;
                newUser = new user_1.default({
                    "password": Bcrypt.hashSync(req.body.user.password, saltRounds),
                    "email": req.body.user.email.toLowerCase(),
                    "name": req.body.name,
                    "picture": req.body.user.picture,
                    "validated": true
                });
                newStudent = new student_1.default({
                    "user": ""
                });
                return [4 /*yield*/, user_1.default.findOne({ "email": newUser.email })];
            case 1:
                s = _a.sent();
                if (!!s) return [3 /*break*/, 3];
                return [4 /*yield*/, newUser.save().then(function (data) {
                        newUser = data;
                        newStudent.user = newUser === null || newUser === void 0 ? void 0 : newUser._id;
                        newStudent.save().then(function () {
                            return res.status(201).json({ "message": "Student created by Google" });
                        });
                    })];
            case 2:
                _a.sent();
                return [3 /*break*/, 4];
            case 3:
                if (s) {
                    return [2 /*return*/, res.status(409).json("User already exists")];
                }
                else {
                    return [2 /*return*/, res.status(500)];
                }
                _a.label = 4;
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.default = { registerUserbyGoogle: registerUserbyGoogle, registerUser: registerUser, accessUser: accessUser, validateUser: validateUser, forgotPassword: forgotPassword, changePassword: changePassword };
//# sourceMappingURL=auth.controller.js.map