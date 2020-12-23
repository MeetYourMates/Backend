"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = __importStar(require("mongoose"));
var chat_1 = __importDefault(require("./chat"));
var insignia_1 = __importDefault(require("./insignia"));
var rating_1 = __importDefault(require("./rating"));
var trophy_1 = __importDefault(require("./trophy"));
var user_1 = __importDefault(require("./user"));
var Course = require('./course');
//Modelo de objeto que se guarda en la BBDD de MongoDB
var studentSchema = new mongoose_1.Schema({
    name: {
        type: String,
        index: true
    },
    university: {
        type: String,
    },
    degree: {
        type: String,
    },
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: user_1.default
    },
    ratings: [{
            type: mongoose_1.Schema.Types.ObjectId,
            ref: rating_1.default
        }],
    rating: {
        type: Number
    },
    trophies: [{
            type: mongoose_1.Schema.Types.ObjectId,
            ref: trophy_1.default
        }],
    insignias: [{
            type: mongoose_1.Schema.Types.ObjectId,
            ref: insignia_1.default
        }],
    chats: [{
            type: mongoose_1.Schema.Types.ObjectId,
            ref: chat_1.default
        }],
    courses: [{
            type: mongoose_1.Schema.Types.ObjectId,
            ref: Course
        }]
});
//Exportamos modelo para poder usarlo
exports.default = mongoose_1.default.model('Student', studentSchema, 'students');
//# sourceMappingURL=student.js.map