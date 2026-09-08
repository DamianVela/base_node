const LoginAttempts = require("../modelos/login_attempt");
const Sesion = require("../modelos/sesion");
const { sumarDias } = require("./fechas");
const { fechaValidaSequelize } = require("./validarDatos");

function parseCookies(cookieHeader) {
    const list = {};
    if (!cookieHeader) return list;
    cookieHeader.split(';').forEach(cookie => {
        let [name, ...rest] = cookie.split('=');
        name = name?.trim();
        if (!name) return;
        const value = rest.join('=').trim();
        list[name] = decodeURIComponent(value);
    });
    return list;
};

function obtenerToken(req) {
    const cookieToken = req.cookies?.token;
    if (cookieToken) {
        return cookieToken;
    }
    const authHeader = req.header('Authorization');
    if (authHeader) {
        return authHeader.split(' ')[1];
    }
    return null;
};

function obtenerRefreshToken(req) {
    const cookieToken = req.cookies?.refresh_token;
    if (cookieToken) {
        return cookieToken;
    }
    const authHeader = req.header('Authorization');
    if (authHeader) {
        return authHeader.split(' ')[1];
    }
    return null;
};

async function loginExitoso(tokenPasado, usuarioEncontrado, refreshToken, dirip, dispo, usuario) {
    try {
        const expiracion = fechaValidaSequelize(sumarDias(new Date(), 7));

        if (tokenPasado) {
            await Sesion.update(
                { Activa: false },
                { where: { IdPersona: usuarioEncontrado.IdPersona } }
            );
        }

        await Sesion.create({
            IdPersona: usuarioEncontrado.IdPersona,
            RefreshToken: refreshToken,
            DirIp: dirip,
            Dispositivo: dispo,
            FechaExpiracion: expiracion
        });

        await LoginAttempts.create({
            Usuario: usuario,
            DirIp: dirip,
            Dispositivo: dispo,
            Exitoso: true
        });

        return;
    } catch (error) {
        return;
    }
};

async function intentoLogin(usuario, dirip, dispo, exitoso, razon) {
    try {
        await LoginAttempts.create({
            Usuario: usuario,
            DirIp: dirip,
            Dispositivo: dispo,
            Exitoso: exitoso,
            Razon: razon
        });
        return;
    } catch (error) {
        return;
    }
};

async function ultimaActividad(sesionActiva) {
    try {
        await sesionActiva.update({
            UltimaActividad: fechaValidaSequelize()
        });
        return;
    } catch (error) {
        return;
    }
};

async function desactivarRefreshToken(refreshToken) {
    try {
        if (refreshToken) {
            await Sesion.update(
                { Activa: false },
                { where: { RefreshToken: refreshToken } }
            );
        }
        return;
    } catch (error) {
        return;
    }
};

module.exports = { parseCookies, obtenerToken, loginExitoso, intentoLogin, 
    ultimaActividad, desactivarRefreshToken, obtenerRefreshToken };