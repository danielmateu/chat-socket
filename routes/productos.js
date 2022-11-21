const { Router } = require('express');
const { check } = require('express-validator');
const { 
    crearProducto, 
    obtenerProductos, 
    obtenerProducto, 
    actualizarProducto ,
    borrarProducto
} = require('../controllers/productos');

const { existeCategoriaPorId, existeProductoPorId } = require('../helpers/db-validators');
const { esAdminRole } = require('../middlewares');

const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

//Obtener todas las Productos - público
router.get('/',  obtenerProductos)

//Obtener una Categoria por id - público
router.get('/:id', [
    check('id','No es un id de mongo válido').isMongoId(),
    check('id').custom(existeCategoriaPorId),
    validarCampos,
], obtenerProducto)

//Crear una producto Privado - Cualquier persona con un token válido
router.post('/',[
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('categoria', 'No es un ID de mongo').isMongoId(),
    check('categoria').custom(existeCategoriaPorId),
    validarCampos,
],  crearProducto);

//Actualizar producto - Privado - Cualquier persona con un token válido
router.put('/:id', 
    validarJWT,
    // check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    // check('categoria', 'No es un ID de mongo').isMongoId(),
    check('id').custom(existeProductoPorId),
    validarCampos,
    actualizarProducto)

//Obtener un producto por id - público
router.get('/:id', [
    check('id','No es un id de mongo válido').isMongoId(),
    check('id').custom(existeProductoPorId),
    validarCampos,
], obtenerProducto)



//Eliminar producto  - Privado . Admin, estado en FALSE
router.delete('/:id', [
    validarJWT,
    esAdminRole,
    check('id','No es un id de mongo válido').isMongoId(),
    check('id').custom(existeProductoPorId),
    validarCampos

], borrarProducto)


module.exports = router;