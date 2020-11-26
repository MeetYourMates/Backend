import Student from "../models/student";
import User from "../models/user";
import Validation from "../models/validation";
import {Request, Response} from "express";
import {hashSync, compareSync} from "bcrypt";
import {generate} from "randomstring";
import {createTransport, Transporter} from "nodemailer";
import {MailOptions} from "nodemailer/lib/smtp-pool";


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
    let newUser = new User({
        "password": hashSync(req.body.password,10),
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
        console.log(req.body);
        const filter = {'email':req.body.email,'password':req.body.password};
        console.log(filter);
        const resultUser = await User.findOne(filter);
        //I have _id, email, password

        if(resultUser!=null){
            console.log("email: "+ resultUser.email);
            const filter2 = {'user': resultUser._id};
            const result = await Student.findOne(filter2).populate('user');
            console.log("student: " + result);
            return res.status(200).json(result);
        }else{
            return res.status(404).json();
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
