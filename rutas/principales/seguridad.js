const express = require('express');
const router = express.Router();
const { autenticaciones, errormulter } = require('../../middlewares');
const { seguridad, logshistorial } = require('../../controladores/sistema');
const multer = require('multer');
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 7 * 1024 * 1024 },
});

//OBTENER LOGIN ATTEMPTS
router.get('/login/attempts', 
    autenticaciones.autenticacionPorNiveles([1]), 
    seguridad.obtenerLoginAttempts);

//OBTENER IPS MALICIOSAS
router.get('/ips/maliciosas', 
    autenticaciones.autenticacionPorNiveles([1]), 
    seguridad.obtenerIntentosFallidosPorIP);

//OBTENER LOGS
router.get('/logs/historial', 
    autenticaciones.autenticacionPorNiveles([1]), 
    logshistorial.obtenerLogsHistorial);

//OBTENER TITULO
router.get('/filtros/logs', 
    autenticaciones.autenticacionPorNiveles([1]), 
    logshistorial.obtenerTitulosRolesAcciones);

//OBTENER SUBTITULOS
router.get('/subtitulos/logs', 
    autenticaciones.autenticacionPorNiveles([1]), 
    logshistorial.obtenerSubTitulos);

module.exports = router;