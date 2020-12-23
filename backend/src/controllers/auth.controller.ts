import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { createTransport } from "nodemailer";
import { MailOptions } from "nodemailer/lib/smtp-pool";
import { generate } from "randomstring";
import config from "../config/config";
import Recovery from "../models/recovery";
import Student, { IStudent } from "../models/student";
import User, { IUser } from "../models/user";
import Validation from "../models/validation";
var path = require('path');
const Bcrypt = require("bcryptjs");
const { body, validationResult } = require('express-validator');
const sendEmail: any = async (receiver: string, code: string) =>  {
    const  transporter = createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        requireTLS: true,
        auth: {
            user: 'meetyourmatesprueba@gmail.com',
            pass: 'hztmdbzaopsgtnal'
        }
    });
    var message = "<h1>Welcome to Meet your Mates!</h1><p>To activate your account, use the next link: <a href='http://localhost:3000/auth/validate/"+code+"'>Activate</a> Or introduce the next code in the app: </p><h3>"+ code +"</h3>";
    let mailOptions: MailOptions = {
        from: 'meetyourmatesprueba@gmail.com',
        to: receiver,
        subject: "Welcome to Meet Your Mates!",
        text: "Welcome to Meet your Mates! To activate your account, use the next link: http://localhost:3000/auth/validate/" +code+ " Or introduce the next code in the app: "+ code,
        html: message
    }
    transporter.sendMail(mailOptions, (error) => {
        if (error) {
            console.log(error);
        }
    })
}

const registerUser: any = async (req: Request, res: Response) => {
    try{
    const saltRounds = 10;
    let newUser = new User({
        "password": Bcrypt.hashSync(req.body.password,saltRounds),
        "email": req.body.email.toLowerCase(),
        "name": req.body.name,
        "picture":"https://res.cloudinary.com/meetyourmatesapi/image/upload/v1608740748/users/585e4bf3cb11b227491c339a_caeqr6.png",
        "validated": false
    });

    User.findOne({"email": newUser.email}).then((s)=>{
        if(!s.validated){
            //Not Validated Than delete the current user
            User.deleteOne({"email": newUser.email}).then(()=>{
                newUser.save().then((data) => {
                    newUser = data;
                })
                let validation = new Validation({
                    "code": generate(7),
                    "user": newUser,
                })
                validation.save().then(() => {
                    sendEmail(newUser.email,validation.code);
                    return res.status(201).json({"message": "User registered",
                    "code": validation.code});
                });
            });
        }else{
            //User Exists and is Validated!
            return res.status(409).json("User already exists");
        }
    });
    }catch(err) {
        console.log(err);
        return res.status(500);
    }
};

//Token created with 1 week expiration
function createToken(user: IUser) {
    return jwt.sign({ id: user.id, email: user.email }, config.jwtSecret, {
        expiresIn: 604800
    });
}
//Custom Student with user = {email,password, token}
function getCustomStudent(student: IStudent,user:any) {
    const result = {_id:student._id,name:student.name,university:student.university,degree:student.degree,user:user,
    ratings:student.ratings,trophies:student.trophies,insignias:student.insignias,
    chats:student.chats,courses:student.courses
    };
    return result;
}

//Login User and returns Student
const accessUser = async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try{
        console.log("Request Body: ",req.body);
        const filter = {'email':req.body.email};
        console.log("Filter Query SignIn",filter);
        User.findOne(filter).then(async (resultUser)=>{
        //I have _id, email, password
        if(resultUser!=null){
            console.log("email: "+ resultUser.email);
            if(Bcrypt.compareSync(req.body.password, resultUser.password)){
                resultUser.password = "password-hidden";
                Student.findOne({"user":resultUser._id}).then((resStudent)=>{
                if(resStudent==null){
                    //* NOT VALIDATED 
                    let userWithoutToken = new User({
                        "_id":resultUser._id,
                        "password": "password-hidden",
                        "email": resultUser.email,
                        "name": resultUser.name,
                        "picture": resultUser.picture,
                        "validated": false,
                        "token":"Not-Authorized"
                    });
                    let studentNotValidated = new Student({
                        "user":userWithoutToken
                    });
                    console.log("Line87:Login--> student hasn't Validated Odd#1 : " + studentNotValidated);
                    return res.status(203).json(studentNotValidated);
                }else{
                    //* Validated
                    Student.findOne({'user': resultUser._id}).populate('user').populate('ratings').populate('trophies').populate('insignias').then((result)=>{
                        /**==============================================
                         **      Validated & Completed Lets Get Started
                         *===============================================**/
                        if(result.courses.length>0){
                            let userWithToken:any = {
                                "_id":result.user._id,
                                "password": "password-hidden",
                                "email": result.user.email,
                                "name": result.user.name,
                                "picture": result.user.picture,
                                "validated": true,
                                "token":createToken(result.user)
                            };
                            const result2 = getCustomStudent(result,userWithToken);
                            //Validated and Has courses than student can login!
                            console.log("Login--> student Validated Result: " + result2);
                            return res.status(200).json(result2);
                        } else{
                            //Student --> user --> token
                            //token: createToken(user)
                            let userWithToken:any = {
                                "_id":result.user._id,
                                "password": "password-hidden",
                                "email": result.user.email,
                                "name": result.user.name,
                                "picture": result.user.picture,
                                "validated": true,
                                "token":createToken(result.user)
                            };
                            //Newly custom created user has now token in the json!
                            const result2 = getCustomStudent(result,userWithToken);
                            console.log("Login--> student Not Enrolled Result: " + result2);
                            return res.status(206).json(result2);
                        }
                    });
                }

                });
            }else{
                return res.status(404).json({'error':'User Password Incorrect!'});
            }
        }else{
            return res.status(404).json({'error':'User Not Found!'});
        }});
    } catch (err) {
        console.log(err);
        return res.status(500).json(err);
    }
}
const sendEmailRecovery: any = async (receiver: string, code: string) =>  {
    const  transporter = createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        requireTLS: true,
        auth: {
            user: 'meetyourmatesprueba@gmail.com',
            pass: 'hztmdbzaopsgtnal'
        }
    });
    var message = "<h1>MYM - Reset Password</h1><p>Need to Reset the password? Just type this code in the app, If you did not make the request, please ignore this email.</p><h3>"+ code +"</h3>";
    let mailOptions: MailOptions = {
        from: 'meetyourmatesprueba@gmail.com',
        to: receiver,
        subject: "Meet Your Mates - Password Reset Request",
        text: "Need to Reset the password? Just type this code in the app: "+code+ " ,If you did not make the request, please ignore this email.",
        html: message
    }
    transporter.sendMail(mailOptions, (error) => {
        if (error) {
            console.log(error);
        }
    })
}
const forgotPassword = async (req: Request, res: Response) => {
    if(req.params.email==null){
        return res.status(400).json({"message":"Bad Request, data requiered"});
    }
    let email = req.params.email;
    //let s = await Validation.findOne({"code": code});
    console.log({email})
    let s = await User.findOne({"email": email});
    if (s) {
        //User Found
        let recovery = new Recovery({
            "code": generate(7),
            "email": email
        })
        recovery.save().then(() => {
            sendEmailRecovery(email,recovery.code);
            return res.status(201).json({"message": "Email Sent"});
        });
    }else{
        //User doesnt Exist
        return res.status(404).json({"message":"No User Found"});
    }
}
const changePassword = async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    //let code = req.params.code;
    //Request.body = {"email":email,"code":code,"password":newPassword};
    if(req.body.email==null||req.body.code==null||req.body.password==null){
        return res.status(400).json({"message":"Bad Request, data requiered"});
    }else if(req.body.password.length<3){
        return res.status(400).json({"message":"Password min length 3"});
    }
    const saltRounds = 10;
    const filter = {'code':req.body.code,'email':req.body.email};
    let s = await Recovery.findOne(filter);
    if (s != null) {
        //let user = await User.findOne({"_id": s.user._id})
        await User.updateOne({"email": req.body.email}, {"password":Bcrypt.hashSync(req.body.password,saltRounds) }).then(() => {
            // @ts-ignore
            s.deleteOne();
            return res.status(200).json({"message":"Sucessfully Changed Password"});
            }
        );
    }else {
        return res.status(500).json({"message":"Code or Email Incorrect"});
    }
}
//Validates User
const validateUser = async (req: Request, res: Response) => {
    let code = req.params.code;
    let s = await Validation.findOne({"code": code});

    if (s != null) {
        let user = await User.findOne({"_id": s.user._id})
        if (user != null) {
            await User.updateOne({"_id": user._id}, {"validated": true}).then(() => {
                // @ts-ignore
                s.deleteOne();
                //Create New Student
                const student = new Student({
                    "user": user?._id
                });
                student.save();
                //return res.status(201).json("User validated");
                return res.status(201).sendFile(path.join(__dirname, "../public",'/views', '/confirmed.html'));
                }
            );
        }
        else {
            return res.status(500);
        }
    }
}
const registerUserbyGoogle: any = async (req: Request, res: Response) => {
    const saltRounds = 10;
    let newUser = new User({
        "password": Bcrypt.hashSync(req.body.user.password,saltRounds),
        "email": req.body.user.email.toLowerCase(),
        "name": req.body.name,
        "picture":req.body.picture,
        "validated": true
    });
    let newStudent = new Student({
        "user":""
    });

    let s = await User.findOne({"email": newUser.email});

    if (!s) {

        await newUser.save().then((data) => {
            newUser = data;
            newStudent.user = newUser?._id;
            newStudent.save().then(() =>{
                return res.status(201).json({"message": "Student created by Google"})
            });
        })
    }
    else if (s) {
        return res.status(409).json("User already exists");
    }
    else {
        return res.status(500);
    }
};

export default {registerUserbyGoogle,registerUser, accessUser, validateUser,forgotPassword,changePassword};

