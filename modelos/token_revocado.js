const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Persona = require('./personal');

const TokenRevocado = sequelize.define('TokenRevocado', {
    IdTokenRevocado: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    Jti: {
        type: DataTypes.STRING(36),
        allowNull: true,
        unique: true,
    },
    FechaCreacion: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
    IdPersona: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: Persona,
            key: 'IdPersona',
        },
    },
}, {
    tableName: 'TOKENS_REVOCADOS',
    timestamps: false,
});

Persona.hasMany(TokenRevocado, {
    foreignKey: 'IdPersona',
    as: 'tokensRevocados',
});

TokenRevocado.belongsTo(Persona, {
    foreignKey: 'IdPersona',
    as: 'persona',
});

module.exports = TokenRevocado;