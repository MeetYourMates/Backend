import Student from "../models/student";
import User from "../models/user";
import Validation from "../models/validation";
import {Request, Response} from "express";
import {hashSync, compareSync} from "bcrypt";
import {generate} from "randomstring";
import {createTransport, Transporter} from "nodemailer";
import {MailOptions} from "nodemailer/lib/smtp-pool";
import user from "../models/user";
const Bcrypt = require("bcryptjs");

const sendEmail: any = async (receiver: string, code: string) =>  {
    const  transporter = createTransport({
        service: 'gmail',
        auth: {
            user: 'meetyourmatesprueba@gmail.com',
            pass: 'MeetYourMatesTest'
        }
    });
    let mailOptions: MailOptions = {
        from: 'meetyourmatesprueba@gmail.com',
        to: receiver,
        subject: "Welcome to Meet Your Mates!",
        text: "Welcome to Meet your Mates! to activate your account, use the next link: http://localhost:3000/auth/validate/" +code+ " Or introduce the next code in the app: "+ code
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
            "user": newUser
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

const accessUser = async (req: Request, res: Response) => {
    try{
        const saltRounds = 10;
        console.log("Request Body: ",req.body);
        const filter = {'email':req.body.email}; //Habría que ehacer el hash aqui?
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
                        //Just in case: if some strange way user has Student Model already added!
                        console.log("Line87:Login--> student hasn't Validated Odd#1 : " + result);
                        return res.status(203).json(result);
                    }else{
                        //User has Courses means ge already has Let's Get Started Finished!
                        if(Array.isArray(result.courses) && result.courses.length){
                            if(result.user.validated){
                                //Validated and Has courses than student can login!
                                console.log("Login--> student Validated Result: " + result);
                                return res.status(200).json(result);
                            }else{
                                    //Just in case: if some strange way user hasn't validated but somehow has courses!
                                    console.log("Line98:Login--> student hasn't Validated Odd#2 : " + result);
                                    return res.status(203).json(result);
                            }
                        } else{
                            //User hasn't enrolled in anycourse
                            result.user.password = "password-hidden";
                            console.log("Login--> student Not Enrolled Result: " + result);
                            return res.status(206).json(result);
                        }
                    }
                }else{
                    //User Not validated so no Student!
                    var stud2 = {user:resultUser}
                    console.log("Login--> student Not Validated: " + result);
                    return res.status(203).json(stud2);
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
                    "name":user?.email,
                });
                student.save();
                return res.status(201).json("User validated");
                }
            );
        }
        else {
            return res.status(500);
        }
    }
}

export default {registerUser, accessUser, validateUser};
