const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Persona = require('./personal');

const Sesion = sequelize.define('Sesion', {
    IdSesion: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    IdPersona: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
        model: Persona, 
        key: 'IdPersona' 
    }},
    RefreshToken: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    DirIp: {
        type: DataTypes.STRING(50),
        allowNull: true
    },
    Dispositivo: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    Activa: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    FechaExpiracion: {
        type: DataTypes.DATE,
        allowNull: true
    },
    FechaCreacion: {
        type: DataTypes.DATE,
        allowNull: true
    },
    UltimaActividad: {
        type: DataTypes.DATE,
        allowNull: true
    }
}, {
    tableName: 'SESIONES',
    timestamps: false,
});

Persona.hasMany(Sesion, {
    foreignKey: 'IdPersona',
    as: 'sesiones'
});

Sesion.belongsTo(Persona, {
    foreignKey: 'IdPersona',
    as: 'persona'
});

module.exports = Sesion;