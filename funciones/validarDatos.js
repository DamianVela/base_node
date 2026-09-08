const sequelize = require('../config/db');

function validarRFC(rfc) {
    if (!rfc) return false;
    rfc = rfc.trim().toUpperCase();
    return /^[A-Z&Ñ]{3,4}[0-9]{6}[A-Z0-9]{3}$/.test(rfc);
};

function validarNumeroOCero(num, decimales = null) {
    if (num === null || num === undefined || num === '') return 0;
    const numNum = Number(num);
    if (!Number.isFinite(numNum)) return 0;
    if (typeof decimales === 'number') {
        return Number(numNum.toFixed(decimales));
    }
    return numNum;
};

function validarNumeroOUno(num, decimales = null) {
    if (num === null || num === undefined || num === '') return 1;
    const numNum = Number(num);
    if (!Number.isFinite(numNum)) return 1;
    if (typeof decimales === 'number') {
        return Number(numNum.toFixed(decimales));
    }
    return numNum;
};

function validarNumerosMayoresACero(listaNumeros) {
    if (!Array.isArray(listaNumeros)) return false;

    return listaNumeros.every(n => typeof n === 'number' && !isNaN(n) && n >= 0);
};

function validarNumeroMayorACero(num) {
    return num === 'number' && !isNaN(num) && num > 0;
};

function esFechaStringValida(fecha) {
    if (!fecha) return false;
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!regex.test(fecha)) return false;
    const date = new Date(fecha);
    if (isNaN(date.getTime())) return false;
    const [anio, mes, dia] = fecha.split('-').map(Number);
    return (
        date.getUTCFullYear() === anio &&
        date.getUTCMonth() + 1 === mes &&
        date.getUTCDate() === dia
    );
};

function esDateValida(fecha) {
    if (!fecha) return false;
    const date = new Date(fecha);
    if (isNaN(date.getTime())) return false;
    return true;
}

function validarRangoFechas(fechaInicio, fechaFin) {
    if (!fechaInicio && !fechaFin) {
        return { valido: false, mensaje: 'Faltan fecha inicio y fecha fin' };
    }
    if (!fechaInicio) {
        return { valido: false, mensaje: 'La fecha inicio no es válida' };
    }
    if (!fechaFin) {
        return { valido: false, mensaje: 'La fecha fin no es válida' };
    }
    const f1 = new Date(fechaInicio);
    const f2 = new Date(fechaFin);
    if (isNaN(f1.getTime())) {
        return { valido: false, mensaje: 'La fecha inicio no es válida' };
    }
    if (isNaN(f2.getTime())) {
        return { valido: false, mensaje: 'La fecha fin no es válida' };
    }
    f1.setHours(0, 0, 0, 0);
    f2.setHours(0, 0, 0, 0);
    if (f1 > f2) {
        return { valido: false, mensaje: 'La fecha inicio no puede ser mayor que la fecha fin' };
    }
    return { valido: true, mensaje: 'Fechas válidas' };
};

function normalizarCelular(celularRaw) {
    try {
        if (!celularRaw || typeof celularRaw !== "string") {
            return "NA";
        }
        let num = celularRaw.replace(/\D/g, "");
        if (!num) return "NA";
        if (num.startsWith("521")) {
            num = num.slice(3);
        } else if (num.startsWith("52")) {
            num = num.slice(2);
            if (num.startsWith("1")) {
                num = num.slice(1);
            }
        } else if (num.startsWith("1")) {
            num = num.slice(1);
        }
        if (num.length !== 10) {
            return "NA";
        }

        return num;
    } catch (err) {
        return "NA";
    }
};

function fechaValidaSequelize(fecha, tipo = 'datetime') {
    const f = fecha ? new Date(fecha) : null;

    if (!f || isNaN(f.getTime())) {
        return tipo === 'date' ? sequelize.literal('CAST(GETDATE() AS DATE)') : sequelize.literal('GETDATE()');
    }

    if (tipo === 'date') {
        return sequelize.literal(`CAST('${f.toISOString().slice(0,10)}' AS DATE)`);
    }

    return sequelize.literal(`CAST('${f.toISOString().slice(0,19).replace('T',' ')}' AS DATETIME)`);
};

function esStringValido(valor) {
    return typeof valor === 'string' && valor.trim().length > 0;
};

function generateRandomCode(maxLength) {
    const characters = '0123456789';
    const length = Math.floor(Math.random() * maxLength) + 1;
    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
};

module.exports = { validarRFC, validarNumeroOCero, validarNumeroOUno, validarNumeroMayorACero, validarNumerosMayoresACero,
    esFechaStringValida, esDateValida, validarRangoFechas, normalizarCelular, fechaValidaSequelize, esStringValido, 
    generateRandomCode
};