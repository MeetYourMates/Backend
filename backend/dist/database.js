"use strict";
//RECETA DE COCINA
//Establecer conexión con la BBDD de MongoDB
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = __importDefault(require("mongoose"));
var config_1 = __importDefault(require("./config/config"));
var dbOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
};
mongoose_1.default.connect(config_1.default.DB.URI, dbOptions);
var connection = mongoose_1.default.connection;
connection.once('open', function () {
    console.log('Connection to MongoDB Established...');
});
connection.on('error', function (err) {
    console.log(err);
    process.exit(0);
});
//# sourceMappingURL=database.js.map