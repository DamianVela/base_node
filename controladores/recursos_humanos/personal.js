const bcrypt = require('bcrypt');
const saltRounds = 10;
const secretKey = process.env.JWT_SECRET;
const secretKeyRefresh = process.env.JWT_REFRESH;
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
const sequelize = require('../../config/db');
const Sesion = require('../../modelos/sesion');
const LogHistorial = require('../../modelos/log_historial');
const Persona = require('../../modelos/personal');
const { loginExitoso, intentoLogin, ultimaActividad, desactivarRefreshToken, obtenerRefreshToken } = require('../../funciones/autenticaciones');
const { erroresDuplicados } = require('../../funciones/errores');

exports.Login = async (req, res) => {
    const { usuario, clave } = req.body;
    const dirip = req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress || null;
    const dispo = req.headers['user-agent'] || null;

    try {
        const [usuarioEncontrado,tokenPasado] = await Promise.all([
            Persona.findOne({
                where: { Usuario: usuario },
                attributes: ['IdPersona', 'Nombre', 'Usuario', 'Clave', 'Activo'], 
                include: {
                    model: Rol,
                    as: 'rol',
                    attributes: ['Nivel', 'Descripcion', 'IdRol'],
                    required: true
                }
            }),
            Sesion.findOne({
                where: { Activa: true },
                include: [
                    {
                        model: Persona,
                        as: 'persona',
                        required: true,
                        attributes: ['Usuario'],
                        where: { Usuario: usuario }
                    }
                ]
            })
        ]);

        if (usuarioEncontrado) {
            if (!usuarioEncontrado.Activo) {
                await intentoLogin(usuario, dirip, dispo, false, 'Usuario Inactivo');
                return res.status(403).json({ error: 'El usuario no está activo' });
            }
            const coincide = await bcrypt.compare(clave, usuarioEncontrado.Clave);

            if (coincide) {
                const token = jwt.sign(
                    {
                        id: usuarioEncontrado.IdPersona,
                        usuario: usuarioEncontrado.Usuario,
                        rol: usuarioEncontrado.rol.Descripcion,
                        nivel: usuarioEncontrado.rol.Nivel,
                        idrol: usuarioEncontrado.rol.IdRol,
                        nombre: usuarioEncontrado.Nombre
                    },
                    secretKey,
                    { expiresIn: '15m' }
                );
                const refreshToken = jwt.sign(
                    {
                        id: usuarioEncontrado.IdPersona,
                        tipo: 'refresh'
                    },
                    secretKeyRefresh,
                    { expiresIn: '7d' }
                );

                await loginExitoso(tokenPasado, usuarioEncontrado, refreshToken, dirip, dispo, usuario);

                res.cookie('token', token, {
                    httpOnly: true,
                    secure: true,
                    sameSite: 'none',
                    maxAge: 15 * 60 * 1000
                });
                res.cookie('refresh_token', refreshToken, {
                    httpOnly: true,
                    secure: true,
                    sameSite: 'none',
                    path: '/auth/refresh',
                    maxAge: 7 * 24 * 60 * 60 * 1000
                });
                res.json({
                    token,
                    refreshToken,
                    persona: {
                        IdPersona: usuarioEncontrado.IdPersona,
                        Nombre: usuarioEncontrado.Nombre,
                        Usuario: usuarioEncontrado.Usuario,
                        Rol: usuarioEncontrado.rol.Descripcion,
                        Nivel: usuarioEncontrado.rol.Nivel,
                        IdRol: usuarioEncontrado.rol.IdRol
                    },
                    liga: dictLigas[usuarioEncontrado.rol.Nivel] || '/menu/1'
                });
            } else {
                await intentoLogin(usuario, dirip, dispo, false, 'No coincide contraseña');
                await new Promise((resolve) => setTimeout(resolve, 1000));
                res.status(404).json({ error: 'Usuario o clave incorrecta' });
            }
        } else {
            await intentoLogin(usuario, dirip, dispo, false, 'Usuario no encontrado');
            res.status(404).json({ error: 'Usuario no encontrado' });
        }
    } catch (error) {
        const mensaje = erroresDuplicados(error);
        res.status(500).json({ error: mensaje });
    }
};

exports.refreshToken = async (req, res) => {
    const refreshToken = obtenerRefreshToken(req);
    
    try {
        const decoded = jwt.verify(refreshToken, secretKeyRefresh);

        const [usuario, sesionActiva] = await Promise.all([
            Persona.findOne({
                where: { IdPersona: decoded.id },
                include: {
                    model: Rol,
                    as: 'rol',
                    attributes: ['Nivel', 'Descripcion', 'IdRol'],
                    required: true
                }
            }),
            Sesion.findOne({
                where: {
                    Activa: true,
                    IdPersona: decoded.id
                }
            })
        ]);

        if (!sesionActiva) {
            return res.status(401).json({
                error: 'Sesión inválida o cerrada'
            });
        }

        if (sesionActiva.RefreshToken !== refreshToken) {
            return res.status(401).json({
                error: `Sesión inválida. Estás conectado en: ${sesionActiva.Dispositivo}. Vuelve a iniciar sesión.`
            });
        }

        if (!usuario) {
            return res.status(401).json({
                error: 'Usuario no encontrado'
            });
        }

        await ultimaActividad(sesionActiva);

        const newAccessToken = jwt.sign(
            {
                id: usuario.IdPersona,
                usuario: usuario.Usuario,
                rol: usuario.rol.Descripcion,
                nivel: usuario.rol.Nivel,
                idrol: usuario.rol.IdRol,
                nombre: usuario.Nombre
            },
            secretKey,
            { expiresIn: '15m' }
        );

        res.cookie('token', newAccessToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: 15 * 60 * 1000
        });
        res.json({
            token: newAccessToken,
            persona: {
                IdPersona: usuario.IdPersona,
                Nombre: usuario.Nombre,
                Usuario: usuario.Usuario,
                Rol: usuario.rol.Descripcion,
                Nivel: usuario.rol.Nivel,
                IdRol: usuario.rol.IdRol
            },
            liga: dictLigas[usuario.rol.Nivel] || '/menu/1'
        });
    } catch (error) {
        return res.status(401).json({ error: 'Refresh token inválido' });
    }
};

exports.logout = async (req, res) => {
    const refreshToken = obtenerRefreshToken(req);
    try {
        await desactivarRefreshToken(refreshToken);

        res.clearCookie('token', {
            httpOnly: true,
            secure: true,
            sameSite: 'none'
        });
        res.clearCookie('refresh_token', {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            path: '/auth/refresh'
        });
        return res.status(200).json({ message: 'Logout exitoso' });
    } catch (error) {
        return res.status(500).json({ error: 'Error al cerrar sesión' });
    }
};