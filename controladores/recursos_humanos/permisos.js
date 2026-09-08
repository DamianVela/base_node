const { erroresDuplicados } = require('../../funciones/errores');
const Permisos = require('../../modelos/permiso');

exports.obtenerPermisos = async (req, res) => {
    const { idrol } = req.params;

    try {
        const permisos = await Permisos.findAll({
            where: {
                IdRol: idrol
            }
        });
  
        res.status(200).json(permisos);
  
    } catch (error) {
      const mensaje = erroresDuplicados(error);
        res.status(500).json({ error: mensaje });
    }
};