const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Rol = sequelize.define('Rol', {
    IdRol: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    Descripcion: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    Nivel: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    Area: {
        type: DataTypes.STRING(2),
        allowNull: false
    }
}, {
    tableName: 'ROLES',
    timestamps: false, 
});

module.exports = Rol;