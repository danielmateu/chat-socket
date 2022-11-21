


const dbValidators  = require('./db-validators');
const generarJWT    = require('./generar-jwt');
const googleVerify  = require('./google-verify');
const subirArchivo  = require('./subir-archivo');
// const comprobarJWT  = require('./comprobar-jwt')

module.exports = {
    ...dbValidators,
    ...generarJWT,
    ...googleVerify,
    ...subirArchivo,
    // ...comprobarJW

}