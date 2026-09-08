const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Rol = require('./rol');
const Ubicacion = require('./ubicacion');

const Persona = sequelize.define('Persona', {
    IdPersona: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    Celular: {
        type: DataTypes.STRING(16),
        allowNull: true,
    },
    ApellidoPaterno: {
        type: DataTypes.STRING(32),
        allowNull: false,
    },
    ApellidoMaterno: {
        type: DataTypes.STRING(32),
        allowNull: false,
    },
    Nombres: {
        type: DataTypes.STRING(64),
        allowNull: false,
    },
    Usuario: {
        type: DataTypes.STRING(20),
        allowNull: false,
        unique: true,
    },
    Clave: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    FechaExpiracionClave: {
        type: DataTypes.DATEONLY,
        allowNull: true,
    },
    IdRol: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Rol,
            key: 'IdRol',
        },
    },
    Activo: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
    },
    Mail: {
        type: DataTypes.STRING(64),
        allowNull: true,
    },
    FechaCreacion: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
    FechaIngreso: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    RutaImagen: {
        type: DataTypes.STRING(2048),
        allowNull: true,
    },
    FechaNacimiento: {
        type: DataTypes.DATEONLY,
        allowNull: true,
    },
    RFC: {
        type: DataTypes.STRING(64),
        allowNull: true,
    },
    NumEmpleado: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    NumImss: {
        type: DataTypes.STRING(16),
        allowNull: true,
    },
    Curp: {
        type: DataTypes.STRING(32),
        allowNull: true,
    },
    IdUbicacion: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: Ubicacion,
            key: 'IdUbicacion',
        },
    },
}, {
    tableName: 'PERSONAL',
    timestamps: false,
});

Rol.hasMany(Persona, {
    foreignKey: 'IdRol',
    as: 'personas',
});

Persona.belongsTo(Rol, {
    foreignKey: 'IdRol',
    as: 'rol',
});

Ubicacion.hasMany(Persona, {
    foreignKey: 'IdUbicacion',
    as: 'personal',
});

Persona.belongsTo(Ubicacion, {
    foreignKey: 'IdUbicacion',
    as: 'ubicacion',
});

module.exports = Persona;