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
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var nodemailer_1 = require("nodemailer");
var randomstring_1 = require("randomstring");
var config_1 = __importDefault(require("../config/config"));
var recovery_1 = __importDefault(require("../models/recovery"));
var student_1 = __importDefault(require("../models/student"));
var user_1 = __importDefault(require("../models/user"));
var validation_1 = __importDefault(require("../models/validation"));
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
    var saltRounds, newUser, s, validation_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                saltRounds = 10;
                newUser = new user_1.default({
                    "password": Bcrypt.hashSync(req.body.password, saltRounds),
                    "email": req.body.email.toLowerCase(),
                    "validated": false
                });
                return [4 /*yield*/, user_1.default.findOne({ "email": newUser.email })];
            case 1:
                s = _a.sent();
                if (!!s) return [3 /*break*/, 3];
                return [4 /*yield*/, newUser.save().then(function (data) {
                        newUser = data;
                    })];
            case 2:
                _a.sent();
                validation_2 = new validation_1.default({
                    "code": randomstring_1.generate(7),
                    "user": newUser,
                    "name": req.body.name,
                    "surname": req.body.surname
                });
                validation_2.save().then(function () {
                    sendEmail(newUser.email, validation_2.code);
                    return res.status(201).json({ "message": "User registered",
                        "code": validation_2.code });
                });
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
//Token created with 1 week expiration
function createToken(user) {
    return jsonwebtoken_1.default.sign({ id: user.id, email: user.email }, config_1.default.jwtSecret, {
        expiresIn: 604800
    });
}
//Custom Student with user = {email,password, token}
function getCustomStudent(student, user) {
    var result = { _id: student._id, name: student.name, university: student.university, degree: student.degree, user: user,
        picture: student.picture, ratings: student.ratings, trophies: student.trophies, insignias: student.insignias,
        chats: student.chats, courses: student.courses
    };
    return result;
}
//Login User and returns Student
var accessUser = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var errors, filter, resultUser, filter2, result, userWithoutToken, userWithToken, result2, userWithToken, result2, userWithoutToken, stud2, result2, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                errors = validationResult(req);
                if (!errors.isEmpty()) {
                    return [2 /*return*/, res.status(400).json({ errors: errors.array() })];
                }
                _a.label = 1;
            case 1:
                _a.trys.push([1, 8, , 9]);
                console.log("Request Body: ", req.body);
                filter = { 'email': req.body.email };
                console.log("Filter Query SignIn", filter);
                return [4 /*yield*/, user_1.default.findOne(filter)];
            case 2:
                resultUser = _a.sent();
                if (!(resultUser != null)) return [3 /*break*/, 6];
                console.log("email: " + resultUser.email);
                if (!Bcrypt.compareSync(req.body.password, resultUser.password)) return [3 /*break*/, 4];
                filter2 = { 'user': resultUser._id };
                resultUser.password = "password-hidden";
                return [4 /*yield*/, student_1.default.findOne(filter2).populate('user').populate('ratings').populate('trophies').populate('insignias')];
            case 3:
                result = _a.sent();
                console.log("Login--> student findone Result: " + result);
                if (result != null) {
                    if (!result.user.validated) {
                        userWithoutToken = { '_id': result.user._id, 'email': result.user.email, 'password': 'password-hidden' };
                        result.user = userWithoutToken;
                        //Just in case: if some strange way user has Student Model already added!
                        console.log("Line87:Login--> student hasn't Validated Odd#1 : " + result);
                        return [2 /*return*/, res.status(203).json(result)];
                    }
                    else {
                        //User has Courses means ge already has Let's Get Started Finished!
                        if (Array.isArray(result.courses) && result.courses.length) {
                            if (result.user.validated) {
                                userWithToken = { '_id': result.user._id, 'email': result.user.email, 'password': 'password-hidden', 'token': createToken(result.user) };
                                result2 = getCustomStudent(result, userWithToken);
                                //Validated and Has courses than student can login!
                                console.log("Login--> student Validated Result: " + result2);
                                return [2 /*return*/, res.status(200).json(result2)];
                            }
                            else {
                                //Not Validated, no Token!!
                                //Just in case: if some strange way user hasn't validated but somehow has courses!
                                console.log("Line98:Login--> student hasn't Validated Odd#2 : " + result);
                                return [2 /*return*/, res.status(203).json(result)];
                            }
                        }
                        else {
                            userWithToken = { '_id': result.user._id, 'email': result.user.email, 'password': 'password-hidden', 'token': createToken(result.user) };
                            result2 = getCustomStudent(result, userWithToken);
                            console.log("Login--> student Not Enrolled Result: " + result2);
                            return [2 /*return*/, res.status(206).json(result2)];
                        }
                    }
                }
                else {
                    userWithoutToken = { '_id': resultUser._id, 'email': resultUser.email, 'password': 'password-hidden' };
                    stud2 = new student_1.default({
                        "user": userWithoutToken
                    });
                    result2 = getCustomStudent(stud2, userWithoutToken);
                    //const result2 = getCustomStudent(stud2,userWithToken);
                    console.log("Login--> student Not Validated: " + result2);
                    return [2 /*return*/, res.status(203).json(result2)];
                }
                return [3 /*break*/, 5];
            case 4: return [2 /*return*/, res.status(404).json({ 'error': 'User Password Incorrect!' })];
            case 5: return [3 /*break*/, 7];
            case 6: return [2 /*return*/, res.status(404).json({ 'error': 'User Not Found!' })];
            case 7: return [3 /*break*/, 9];
            case 8:
                err_1 = _a.sent();
                console.log(err_1);
                return [2 /*return*/, res.status(500).json(err_1)];
            case 9: return [2 /*return*/];
        }
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
    var email, s, recovery_2;
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
    var code, s, user_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                code = req.params.code;
                return [4 /*yield*/, validation_1.default.findOne({ "code": code })];
            case 1:
                s = _a.sent();
                if (!(s != null)) return [3 /*break*/, 5];
                return [4 /*yield*/, user_1.default.findOne({ "_id": s.user._id })];
            case 2:
                user_2 = _a.sent();
                if (!(user_2 != null)) return [3 /*break*/, 4];
                return [4 /*yield*/, user_1.default.updateOne({ "_id": user_2._id }, { "validated": true }).then(function () {
                        // @ts-ignore
                        s.deleteOne();
                        //Create New Student
                        var student = new student_1.default({
                            "user": user_2 === null || user_2 === void 0 ? void 0 : user_2._id,
                            "name": (s === null || s === void 0 ? void 0 : s.name) + " " + (s === null || s === void 0 ? void 0 : s.surname),
                            "picture": "https://res.cloudinary.com/mym/image/upload/v1607678821/mym/blank-profile-picture-973460_640_wn9bqw.webp"
                        });
                        student.save();
                        //return res.status(201).json("User validated");
                        return res.status(201).sendFile(path.join(__dirname, "../dist/public", '/views', '/confirmed.html'));
                    })];
            case 3:
                _a.sent();
                return [3 /*break*/, 5];
            case 4: return [2 /*return*/, res.status(500)];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.default = { registerUser: registerUser, accessUser: accessUser, validateUser: validateUser, forgotPassword: forgotPassword, changePassword: changePassword };
//# sourceMappingURL=auth.controller.js.map