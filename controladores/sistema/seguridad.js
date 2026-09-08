const { Op } = require('sequelize');
const sequelize = require('../../config/db');
const { erroresDuplicados } = require('../../funciones/errores');
const LoginAttempts = require('../../modelos/login_attempt');
const { fechaValidaSequelize } = require('../../funciones/validarDatos');

exports.obtenerLoginAttempts = async (req, res) => {
    const { pagina = 1, fechainicio, fechafin, estatus, dirip } = req.query;
    const idusuario = req.usuario.id;

    try {
        const limite = 20;
        const offset = (pagina - 1) * limite;

        let whereClause = {};

        if (dirip) {
            whereClause.DirIp = dirip;
        }

        if (estatus) {
            switch (estatus) {
                case 'EXITOSO':
                    whereClause.Exitoso = true;
                    break;
                case 'FALLIDO':
                    whereClause.Exitoso = false;
                    break;
                default:
                    break;
            }
        }

        if (fechainicio) {
            whereClause.Fecha = {
                ...whereClause.Fecha,
                [Op.gte]: fechaValidaSequelize(fechainicio)
            };
        }

        if (fechafin) {
            whereClause.Fecha = {
                ...whereClause.Fecha,
                [Op.lte]: fechaValidaSequelize(fechafin)
            };
        }

        const { count: cantidadfilas, rows: logins } = await LoginAttempts.findAndCountAll({
            where: whereClause,
            order: [['IdLoginAttempt', 'DESC']],
            limit: limite,
            offset: offset
        });

        const totalPaginas = Math.max(1, Math.ceil(cantidadfilas / limite));

        res.status(200).json({
            cantidadfilas,
            totalPaginas,
            paginaActual: pagina,
            logins
        });
  
    } catch (error) {
        const mensaje = erroresDuplicados(error);
        res.status(500).json({ error: mensaje });
    }
};

exports.obtenerIntentosFallidosPorIP = async (req, res) => {
    try {
        const haceUnMes = new Date();
        haceUnMes.setMonth(haceUnMes.getMonth() - 1);

        const intentos = await LoginAttempts.findAll({
            attributes: [
                'DirIp',
                [sequelize.fn('COUNT', sequelize.col('IdLoginAttempt')), 'cantidadIntentos'],
                [sequelize.fn('MAX', sequelize.col('Fecha')), 'ultimoIntento']
            ],
            where: {
                Exitoso: false,
                DirIp: {
                    [Op.ne]: null
                },
                Fecha: {
                    [Op.gte]: fechaValidaSequelize(haceUnMes)
                }
            },
            group: ['DirIp'],
            having: sequelize.literal('COUNT(IdLoginAttempt) >= 5'),
            order: [[sequelize.literal('cantidadIntentos'), 'DESC']]
        });

        res.status(200).json(intentos);

    } catch (error) {
        const mensaje = erroresDuplicados(error);
        res.status(500).json({ error: mensaje });
    }
};