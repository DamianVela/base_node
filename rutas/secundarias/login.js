const express = require('express');
const router = express.Router();
const { apilimiters } = require('../../middlewares');
const { personal } = require('../../controladores/recursos_humanos');

//LOGIN
router.post('/', 
    apilimiters.apiLoginLimiter, 
    personal.Login);

//REFRESH
router.post('/refresh', 
    apilimiters.limiterRefresh, 
    personal.refreshToken);

//LOGOUT
router.post('/logout', 
    personal.logout);

module.exports = router;