const jwt = require('jsonwebtoken');

// ESTO SIRVE PARA GENERAR JSON WEB TOKEN
// PARA UTILIZAR EN ALGUN CONTROLLER SE DEBE IMPORTAR, SE INTANCIA
const generarJWT = ( uid ) => {
    return new Promise( (resolve, reject ) => {

        const payload = {
            uid
        };
    
        jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: '12h'
        }, (err, token) => {
    
            if (err) {
                console.log(err);
                reject('Error no se pudo generar JWT');
            } else {
                resolve( token );
            }
    
        });

    });
}

module.exports = {
    generarJWT
}