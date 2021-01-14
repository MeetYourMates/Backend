//Configuraciones para conexion con BBDD
export default {
    jwtSecret: process.env.JWT_SECRET || 'meetyourmatessecrettoken',
    expirationTime: 5,
    DB: {
        URI: process.env.MONGODB_URI || 'mongodb://localhost/mym',
        USER: process.env.MONGODB_USER,
        PASSWORD: process.env.MONGODB_PASSWORD
    }
}