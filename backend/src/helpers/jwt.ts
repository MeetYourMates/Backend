import config from "../config/config";

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
const comprobarJWT = ( token = '' ) => {

    try {

        const { id, email } = jwt.verify( token, config.jwtSecret );
        return [ true, id,email];

    } catch (error) {
        return [ false, null ,null];
    }
}


module.exports = {
    comprobarJWT
}