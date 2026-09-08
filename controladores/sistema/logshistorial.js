const LogsHistorial = require('../../modelos/log_historial');
const Rol = require('../../modelos/rol');
const Personal = require('../../modelos/personal');
const sequelize = require('../../config/db');
const { Op } = require('sequelize');
const { erroresDuplicados } = require('../../funciones/errores');
const { fechaValidaSequelize } = require('../../funciones/validarDatos');

exports.obtenerLogsHistorial = async (req, res) => {
    const { idrol, fechainicio, fechafin, accion, subtitulo, titulo, pagina = 1 } = req.query;

    const limite = 20;
    const offset = (pagina - 1) * limite;

    let whereClause = {};
    let whereRoles = {};

    if (idrol) {
        whereRoles.IdRol = idrol;
    }

    if (accion) {
        whereClause.Accion = accion;
    }

    if (subtitulo) {
        whereClause.SubTitulo = subtitulo;
    }

    if (titulo) {
        whereClause.Titulo = titulo;
    }

    if (fechainicio) {
        whereClause.FechaCreacion = {
            ...whereClause.FechaCreacion,
            [Op.gte]: fechaValidaSequelize(fechainicio)
        };
    }

    if (fechafin) {
        whereClause.FechaCreacion = {
            ...whereClause.FechaCreacion,
            [Op.lte]: fechaValidaSequelize(fechafin)
        };
    }

    try {

        const { count: cantidadfilas, rows: logshistorial } = await LogsHistorial.findAndCountAll({
            include: [
                {
                    model: Personal,
                    as: 'personaAccion',
                    required: true,
                    include: [
                        {
                            model: Rol,
                            as: 'rol',
                            required: true,
                            attributes: ['Descripcion', 'IdRol'],
                            where: whereRoles
                        }
                    ],
                    attributes: ['Nombre']
                }
            ],
            where: whereClause,
            order: [['FechaCreacion', 'DESC']],
            limit: limite,
            offset: offset
        });

        const totalPaginas = Math.max(1, Math.ceil(cantidadfilas / limite));
  
        res.status(200).json({ logshistorial, cantidadfilas, totalPaginas, paginaActual: pagina });
  
    } catch (error) {
        const mensaje = erroresDuplicados(error);
        res.status(500).json({ error: mensaje });
    }
};

exports.obtenerTitulosRolesAcciones = async (req, res) => {
    try {
        const titulos = await LogsHistorial.findAll({
            attributes: [
                [sequelize.fn('DISTINCT', sequelize.col('Titulo')), 'Titulo']
            ]
        });

        const acciones = await LogsHistorial.findAll({
            attributes: [
                [sequelize.fn('DISTINCT', sequelize.col('Accion')), 'Accion']
            ]
        });

        const roles = await Rol.findAll();
  
        res.status(200).json({ titulos, roles, acciones });
  
    } catch (error) {
        const mensaje = erroresDuplicados(error);
        res.status(500).json({ error: mensaje });
    }
};

exports.obtenerSubTitulos = async (req, res) => {
    const { titulo } = req.query;
    try {

        const subtitulos = await LogsHistorial.findAll({
            attributes: [
                [sequelize.fn('DISTINCT', sequelize.col('SubTitulo')), 'SubTitulo']
            ],
            where: {
                Titulo: titulo
            }
        });
  
        res.status(200).json({ subtitulos });
  
    } catch (error) {
        const mensaje = erroresDuplicados(error);
        res.status(500).json({ error: mensaje });
    }
};