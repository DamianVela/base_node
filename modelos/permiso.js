const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Rol = require('./rol');

const Permiso = sequelize.define('Permiso', {
    IdPermiso: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    NombreMenu: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    IdRol: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Rol, 
            key: 'IdRol' 
        }
    }
}, {
  tableName: 'PERMISOS',
  timestamps: false, 
});

Rol.hasMany(Permiso, {
    foreignKey: 'IdRol',
    as: 'permisos'
  });
  
Permiso.belongsTo(Rol, {
    foreignKey: 'IdRol',
    as: 'rol'
});

module.exports = Permiso;