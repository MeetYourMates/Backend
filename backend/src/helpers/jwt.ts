import config from "../config/config";
import User, { IUser } from "../models/user";
const jwt = require('jsonwebtoken');

//Token created with 1 week expiration = 604800, 1 Year expiration =  
function createToken(user: IUser) {
    return jwt.sign({ id: user.id, email: user.email }, config.jwtSecret, {
        expiresIn: '365d'
    });
}
function CheckJWT(token:string): Promise<[boolean,string]>{
    return new Promise((resolve,reject )=>{
        try {
            const { id, email } = jwt.verify(token, config.jwtSecret);
           User.findOne({ "_id": id }).select('_id').lean().then((usr)=>{
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