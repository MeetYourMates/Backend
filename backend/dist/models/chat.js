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
var message_1 = __importDefault(require("./message"));
var user_1 = __importDefault(require("./user"));
//Modelo de objeto que se guarda en la BBDD de MongoDB
var chatSchema = new mongoose_1.Schema({
    //Name, Description, Picture will only be available for group Chats
    name: {
        type: String
    },
    description: {
        type: String
    },
    picture: {
        type: String
    },
    users: [{
            type: mongoose_1.Schema.Types.ObjectId,
            ref: user_1.default
        }],
    messages: [{
            type: mongoose_1.Schema.Types.ObjectId,
            ref: message_1.default
        }],
    isGroupChat: {
        type: Boolean
    }
});
//Exportamos modelo para poder usarlo 
//Mongoose#model(name, [schema], [collectionName], [skipInit])
exports.default = mongoose_1.default.model('Chat', chatSchema, 'chats');
//# sourceMappingURL=chat.js.map