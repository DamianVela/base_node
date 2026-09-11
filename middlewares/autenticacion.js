const jwt = require('jsonwebtoken');
const secretKey = process.env.JWT_SECRET;
const { parseCookies, obtenerToken } = require('../funciones/autenticaciones');

exports.autenticacionLeve = (req, res, next) => {
    const token = obtenerToken(req);
    if (!token) {
        return res.status(401).json({ error: 'Acceso denegado. No se proporcionó un token.' });
    }
    try {
        const verificado = jwt.verify(token, secretKey);

        if (!verificado.nivel) {
            return res.status(402).json({ error: 'No se pudo verificar el nivel de autorización.' });
        }
        req.usuario = verificado;
        next();

    } catch (error) {
        res.status(401).json({ error: 'Token no válido, vuelve a iniciar sesión.' });
    }
};

exports.autenticacionPorNiveles = (nivelesPermitidos = []) => {
    return (req, res, next) => {
        const token = obtenerToken(req);
        if (!token) {
            return res.status(401).json({ error: 'Acceso denegado. No se proporcionó un token.' });
        }
        try {
            const verificado = jwt.verify(token, secretKey);
            if (!verificado.nivel) {
                return res.status(403).json({ error: 'No se pudo verificar el nivel de autorización.' });
            }
            if (!nivelesPermitidos.includes(verificado.nivel)) {
                return res.status(403).json({ error: 'Acceso denegado. No tiene permisos suficientes.' });
            }
            req.usuario = verificado;
            next();
        } catch (error) {
            return res.status(401).json({ error: 'Token no válido, vuelve a iniciar sesión.' });
        }
    };
};

exports.socket_autenticacion = (io) => {
    io.use((socket, next) => {
        const cookies = socket.handshake.headers.cookie;
        if (!cookies) {
            return next(new Error("No autorizado"));
        }
        const parsed = parseCookies(socket.handshake.headers.cookie);
        const token = parsed.token;
        if (!token) {
            return next(new Error("No autorizado"));
        }
        try {
            const decoded = jwt.verify(token, secretKey);
            socket.usuario = decoded;
            next();
        } catch (err) {
            next(new Error("Token inválido"));
        }
    });
};