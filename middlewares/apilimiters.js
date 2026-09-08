const rateLimit = require('express-rate-limit');

const apiLimiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 300,
    handler: (req, res) => {
        return res.status(429).json({ error: 'Demasiadas peticiones. Intente más tarde.' });
    },
});

const apiLoginLimiter = rateLimit({
    windowMs: 5 * 60 * 1000, 
    max: 30, 
    handler: (req, res) => {
        const resetSeconds = Math.ceil(
            (req.rateLimit.resetTime - new Date()) / 1000
        );
        return res.status(429).json({
            error: `Demasiados intentos. Intenta de nuevo en ${resetSeconds} segundos.`,
        });
    }
});

const limiterRefresh = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 60,
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req) => {
        if (req.cookies?.refresh_token) {
            return `refresh:${req.cookies.refresh_token}`;
        }
        return ipKeyGenerator(req.ip);
    }
});

module.exports = { apiLimiter, apiLoginLimiter, limiterRefresh };