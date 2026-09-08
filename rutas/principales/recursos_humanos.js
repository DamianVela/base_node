const express = require('express');
const router = express.Router();
const login = require('../secundarias/login');
const roles = require('../secundarias/roles');
const permisos = require('../secundarias/permisos');

//LOGIN
router.use('/login', login);

//ROLES
router.use('/roles', roles);

//PERMISOS
router.use('/permisos', permisos);

module.exports = router;