const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Ubicacion = sequelize.define('Ubicacion', {
    IdUbicacion: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    Pais: {
      type: DataTypes.STRING(32),
      allowNull: true,
    },
    Estado: {
      type: DataTypes.STRING(32),
      allowNull: true,
    },
    Calle: {
      type: DataTypes.STRING(32),
      allowNull: true,
    },
    CodigoPostal: {
      type: DataTypes.STRING(16),
      allowNull: true,
    },
    Municipio: {
      type: DataTypes.STRING(32),
      allowNull: true,
    },
    Colonia: {
      type: DataTypes.STRING(32),
      allowNull: true,
    },
    NumeroExterior: {
      type: DataTypes.STRING(16),
      allowNull: true,
    },
    Coordenadas: {
      type: DataTypes.GEOMETRY('POINT'),
      allowNull: false,
    },
}, {
    tableName: 'UBICACIONES',
    timestamps: false,
});

module.exports = Ubicacion;