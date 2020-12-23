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
    const saltRounds = 10;
    let newUser = new User({
        "password": Bcrypt.hashSync(req.body.password,saltRounds),
        "email": req.body.email.toLowerCase(),
        "validated": false
    });

    let s = await User.findOne({"email": newUser.email});

    if (!s) {

        await newUser.save().then((data) => {
            newUser = data;
        })
        let validation = new Validation({
            "code": generate(7),
            "user": newUser,
            "name": req.body.name,
            "surname": req.body.surname
        })
        validation.save().then(() => {
            sendEmail(newUser.email,validation.code);
            return res.status(201).json({"message": "User registered",
            "code": validation.code});
        })
    }
    else if (s) {
        return res.status(409).json("User already exists");
    }
    else {
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
    picture:student.picture,ratings:student.ratings,trophies:student.trophies,insignias:student.insignias,
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
        const resultUser = await User.findOne(filter);
        //I have _id, email, password
        if(resultUser!=null){
            console.log("email: "+ resultUser.email);
            if(Bcrypt.compareSync(req.body.password, resultUser.password)){
                const filter2 = {'user': resultUser._id};
                resultUser.password = "password-hidden";
                const result = await Student.findOne(filter2).populate('user').populate('ratings').populate('trophies').populate('insignias');
                console.log("Login--> student findone Result: " + result);
                if(result !=null){
                    if(!result.user.validated){
                        //Not Validated, no Token!!
                        const userWithoutToken = {'_id': result.user._id,'email':result.user.email,'password':'password-hidden'};
                        result.user = userWithoutToken;
                        //Just in case: if some strange way user has Student Model already added!
                        console.log("Line87:Login--> student hasn't Validated Odd#1 : " + result);
                        return res.status(203).json(result);
                    }else{
                        //User has Courses means ge already has Let's Get Started Finished!
                        if(Array.isArray(result.courses) && result.courses.length){
                            if(result.user.validated){
                                //Student --> user --> token
                                //token: createToken(user)
                                const userWithToken = {'_id': result.user._id,'email':result.user.email,'password':'password-hidden','token':createToken(result.user)};
                                //Newly custom created user has now token in the json!
                                const result2 = getCustomStudent(result,userWithToken);
                                //Validated and Has courses than student can login!
                                console.log("Login--> student Validated Result: " + result2);
                                return res.status(200).json(result2);
                            }else{
                                //Not Validated, no Token!!
                                //Just in case: if some strange way user hasn't validated but somehow has courses!
                                console.log("Line98:Login--> student hasn't Validated Odd#2 : " + result);
                                return res.status(203).json(result);
                            }
                        } else{
                            //Student --> user --> token
                            //token: createToken(user)
                            const userWithToken = {'_id': result.user._id,'email':result.user.email,'password':'password-hidden','token':createToken(result.user)};
                            //Newly custom created user has now token in the json!
                            const result2 = getCustomStudent(result,userWithToken);
                            console.log("Login--> student Not Enrolled Result: " + result2);
                            return res.status(206).json(result2);
                        }
                    }
                }else{
                    //User Not validated so no Student!
                    const userWithoutToken = {'_id': resultUser._id,'email':resultUser.email,'password':'password-hidden'};
                    //var stud2:IStudent = {user:userWithToken}
                    let stud2 = new Student({
                        "user": userWithoutToken
                    });
                    const result2 = getCustomStudent(stud2,userWithoutToken);
                    //const result2 = getCustomStudent(stud2,userWithToken);
                    console.log("Login--> student Not Validated: " + result2);
                    return res.status(203).json(result2);
                }

            }else{
                return res.status(404).json({'error':'User Password Incorrect!'});
            }
        }else{
            return res.status(404).json({'error':'User Not Found!'});
        }
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
                    "user": user?._id,
                    "name": s?.name + " " + s?.surname,
                    "picture": "https://res.cloudinary.com/mym/image/upload/v1608718659/mym/blank-profile-picture-973460_640_o2p879.png"
                });
                student.save();
                //return res.status(201).json("User validated");
                return res.status(201).sendFile(path.join(__dirname, "../dist/public",'/views', '/confirmed.html'));
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
        "validated": true
    });
    let newStudent = new Student({
        "name": req.body.name,
        "picture":req.body.picture,
    });

    let s = await User.findOne({"email": newUser.email});

    if (!s) {

        await newUser.save().then((data) => {
            newUser = data;
            newStudent.user = newUser?._id;
            newStudent.save().then((data) =>{
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

