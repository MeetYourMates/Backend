import config from "../config/config";
import User, { IUser } from "../models/user";
const jwt = require('jsonwebtoken');

interface IUserJson
{
    id: string,
    email: string
}

//Token created with 1 week expiration = 604800, 1 Year expiration =  
function createToken(user:IUser) {
    const payload:IUserJson={ id: user.id.toString(), email: user.email };
    const token = jwt.sign(payload, config.jwtSecret, {
        expiresIn: '365d'
    });
    return token;
}
function CheckJWT(token:string): Promise<[boolean,string]>{
    return new Promise((resolve,reject )=>{
        try {
            const element = jwt.verify(token, config.jwtSecret);
           User.findOne({ "_id": element.id }).select('_id').lean().then((usr)=>{
                if(usr==null){
                    reject(new Error("No User with this token-->Invalid token!"));   
                }
                //usr.password = "password-hidden";
                resolve( [true, usr['_id'].toString()]);
            });
        } catch (error) {
            //console.log("JWT Helper--> CheckJWT: ", error);
            reject(new Error(error));
        }
    });
}

export default {
    CheckJWT,
    createToken
}