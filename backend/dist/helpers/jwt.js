"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = __importDefault(require("../config/config"));
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
const comprobarJWT = (token = '') => {
    console.log("Testing Token1!");
    try {
        console.log("Testing Token!");
        console.log("Token: " + token);
        const { id, email } = jwt.verify(token, config_1.default.jwtSecret);
        return [true, id, email];
    }
    catch (error) {
        return [false, null, null];
    }
};
exports.default = {
    comprobarJWT
};
//# sourceMappingURL=jwt.js.map