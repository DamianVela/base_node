const express = require('express');
const router = express.Router();
const { autenticaciones } = require('../../middlewares');
const { permisos } = require('../../controladores/recursos_humanos');

//OBTENER PERMISOS DE ACUERDO AL ROL
router.get('/:idrol', 
    autenticaciones.autenticacionLeve, 
    permisos.obtenerPermisos);

module.exports = router;