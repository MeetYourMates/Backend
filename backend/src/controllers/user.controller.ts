import e, {request, Request, response, Response} from 'express';
import User from '../models/user';
import Student from '../models/student';

function newUser (req: Request, res: Response): void {
    //Todo : Not Finished 
    let user = new User({
        "email" : req.body.email,
        "password" : req.body.password,
    });
    res.status(201).json();
    user.save().then((data) => {
        return res.status(201).json(data);
    }).catch((err) =>{
        console.log(err);
        return res.status(500).json(err);
    })
}
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
export default {newUser,accessUser};
