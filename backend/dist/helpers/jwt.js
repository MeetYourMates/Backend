"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var config_1 = __importDefault(require("../config/config"));
var user_1 = __importDefault(require("../models/user"));
var jwt = require('jsonwebtoken');
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
function CheckJWT(token) {
    return new Promise(function (resolve, reject) {
        try {
            var _a = jwt.verify(token, config_1.default.jwtSecret), id = _a.id, email = _a.email;
            user_1.default.findOne({ "_id": id }).then(function (usr) {
                if (usr == null) {
                    reject(new Error("No User with this token-->Invalid token!"));
                }
                usr.password = "password-hidden";
                resolve([true, usr]);
            });
        }
        catch (error) {
            //console.log("JWT Helper--> CheckJWT: ", error);
            reject(new Error(error));
        }
    });
}
exports.default = {
    CheckJWT: CheckJWT
};
//# sourceMappingURL=jwt.js.map