import config from "../config/config";
import User, { IUser } from "../models/user";
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
//Returns a Promise with a tuple of [boolean and User]
async function CheckJWT(token = ''): Promise<[boolean , IUser]> {
    console.log("Testing Token1!");
    try {
        console.log("Testing Token!");
        console.log("Token: " + token);
        const { id, email } = jwt.verify(token, config.jwtSecret);
        const usr: IUser = await User.findOne({ "_id": id });
        usr.password = "password-hidden";
        return [true, usr];

    } catch (error) {
        console.log("JWT Helper--> CheckJWT: ", error);
        return [false, null];
    }
}

export default {
    CheckJWT
}