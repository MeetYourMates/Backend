import Student from "../models/student";
import {Request, Response} from "express";
import {hashSync, compareSync} from "bcrypt";

const registerStudent: any = async (req: Request, res: Response) => {
    let newUser = new Student({
        "name": req.body.name,
        "password": hashSync(req.body.password,10),
        "email": req.body.email
    });

    let s = await Student.findOne({"email": newUser.email});

    if (!s) {
        await newUser.save().then((data) => {
            return res.status(201).json("User registered");
        })
    }
    else if (s) {
        return res.status(409).json("User already exists");
    }
    else {
        return res.status(500);
    }
};

export default {registerStudent};
