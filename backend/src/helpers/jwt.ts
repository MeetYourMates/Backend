import config from "../config/config";
import User from "../models/user";
const jwt = require('jsonwebtoken');

/*
const generarJWT = ( user: User ) => {

    return new Promise( (resolve, reject) => {

        const payload = { id: user.id, email: user.email };

        jwt.sign( payload, config.jwtSecret, {
            expiresIn: '24h'
        }, ( err, token ) => {

            if ( err ) {
                // no se pudo crear el token
                reject('No se pudo generar el JWT');

            } else {
                // TOKEN!
                resolve( token );
            }

        })

    });
}
*/
function CheckJWT(token:string){
    return new Promise((resolve,reject )=>{
        try {
            const { id, email } = jwt.verify(token, config.jwtSecret);
           User.findOne({ "_id": id }).then((usr)=>{
                if(usr==null){
                    reject(new Error("No User with this token-->Invalid token!"));   
                }
                usr.password = "password-hidden";
                resolve( [true, usr]);
            });
        } catch (error) {
            //console.log("JWT Helper--> CheckJWT: ", error);
            reject(new Error(error));
        }
    });
}

export default {
    CheckJWT
}