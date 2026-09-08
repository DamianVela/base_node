const { erroresDuplicados } = require('../../funciones/errores');
const Rol = require('../../modelos/rol');

exports.obtenerRoles = async (req, res) => {
    try {
        const roles = await Rol.findAll();
  
        res.status(200).json(roles);
  
    } catch (error) {
      const mensaje = erroresDuplicados(error);
        res.status(500).json({ error: mensaje });
    }
};