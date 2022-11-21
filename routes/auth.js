const { Router } = require('express');
const { check } = require('express-validator');

// const { validarCampos } = require('../middlewares/validar-campos');

const { login, googleSignIn, renovarToken } = require('../controllers/auth');
const {validarJWT, validarCampos} = require('../middlewares/');


const router = Router();

router.post('/login',[
    check('correo', 'El correo es obligatorio').isEmail(),
    check('password', 'La contraseña es obligatoria').not().isEmpty(),
    validarCampos
],login );


router.post('/google',[
    check('id_token', 'El id_token de Google es necesario').not().isEmpty(),
    // check('password', 'La contraseña es obligatoria').not().isEmpty(),
    validarCampos
],googleSignIn );

router.get('/', validarJWT, renovarToken );



module.exports = router;