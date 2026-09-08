const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Personal = require('./personal');  

const LogHistorial = sequelize.define('LogHistorial', {
  IdLog: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  Titulo: {
    type: DataTypes.STRING(20),
    allowNull: false,
  },
  SubTitulo: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  Accion: {
    type: DataTypes.STRING(30),
    allowNull: false,
  },
  Referencia: {
    type: DataTypes.STRING(200),
    allowNull: false,
  },
  FechaCreacion: {
    type: DataTypes.DATE,
    allowNull: true
  },
  IdPersona: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Personal,
      key: 'IdPersona',
    },
  }
}, {
  tableName: 'LOGS_HISTORIAL',
  timestamps: false, 
});

LogHistorial.belongsTo(Personal, { 
    foreignKey: 'IdPersona', 
    as: 'personaAccion' 
});

Personal.hasMany(LogHistorial, { 
    foreignKey: 'IdPersona', 
    as: 'logs' 
});

module.exports = LogHistorial;