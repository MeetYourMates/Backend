"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = __importDefault(require("../config/config"));
const user_1 = __importDefault(require("../models/user"));
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
function CheckJWT(token = '') {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("Testing Token1!");
        try {
            console.log("Testing Token!");
            console.log("Token: " + token);
            const { id, email } = jwt.verify(token, config_1.default.jwtSecret);
            const usr = yield user_1.default.findOne({ "_id": id });
            usr.password = "password-hidden";
            return [true, usr];
        }
        catch (error) {
            console.log("JWT Helper--> CheckJWT: ", error);
            return [false, null];
        }
    });
}
exports.default = {
    CheckJWT
};
//# sourceMappingURL=jwt.js.map