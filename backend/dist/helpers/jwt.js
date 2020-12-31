"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var config_1 = __importDefault(require("../config/config"));
var user_1 = __importDefault(require("../models/user"));
var jwt = require('jsonwebtoken');
//Token created with 1 week expiration = 604800, 1 Year expiration =  
function createToken(user) {
    return jwt.sign({ id: user.id, email: user.email }, config_1.default.jwtSecret, {
        expiresIn: '365d'
    });
}
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
    CheckJWT: CheckJWT,
    createToken: createToken
};
//# sourceMappingURL=jwt.js.map