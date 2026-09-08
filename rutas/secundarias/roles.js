const express = require('express');
const router = express.Router();
const { autenticaciones } = require('../../middlewares');
const { roles } = require('../../controladores/recursos_humanos');

//OBTENER ROLES
router.get('/', 
    autenticaciones.autenticacionLeve, 
    roles.obtenerRoles);

module.exports = router;