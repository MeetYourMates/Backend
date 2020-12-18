"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//Configuraciones para conexion con BBDD
exports.default = {
    jwtSecret: process.env.JWT_SECRET || 'meetyourmatessecrettoken',
    DB: {
        URI: process.env.MONGODB_URI || 'mongodb://localhost/mym',
        USER: process.env.MONGODB_USER,
        PASSWORD: process.env.MONGODB_PASSWORD
    }
};
//# sourceMappingURL=config.js.map