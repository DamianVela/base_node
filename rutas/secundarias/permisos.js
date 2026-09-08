const express = require('express');
const router = express.Router();
const { autenticaciones } = require('../../middlewares');
const { permisos } = require('../../controladores/personal');

//OBTENER PERMISOS DE ACUERDO AL ROL
router.get('/:idrol', 
    autenticaciones.autenticacionLeve, 
    permisos.obtenerPermisos);

module.exports = router;