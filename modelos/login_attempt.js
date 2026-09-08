const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const LoginAttempts = sequelize.define('LoginAttempts', {
    IdLoginAttempt: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    Usuario: {
        type: DataTypes.STRING(50),
        allowNull: true
    },
    DirIp: {
        type: DataTypes.STRING(50),
        allowNull: true
    },
    Dispositivo: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    Razon: {
        type: DataTypes.STRING(64),
        allowNull: true
    },
    Exitoso: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    Fecha: {
        type: DataTypes.DATE,
        allowNull: true
    }
}, {
    tableName: 'LOGIN_ATTEMPTS',
    timestamps: false,
});

module.exports = LoginAttempts;