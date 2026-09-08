function diasHabilesYSabadoEntreFechas(fechaInicio, fechaFin) {
    const inicio = new Date(fechaInicio + 'T00:00:00');
    const fin = new Date(fechaFin + 'T00:00:00');
    if (isNaN(inicio) || isNaN(fin)) {
        return 0;
    }
    if (inicio > fin) {
        return 0;
    }
    let diasHabiles = 0;
    const actual = new Date(inicio);
    while (actual <= fin) {
        const dia = actual.getDay(); 
        if (dia !== 0) {
            diasHabiles++;
        }
        actual.setDate(actual.getDate() + 1);
    }
    return diasHabiles;
};

function diasHabilesEntreFechas(fechaInicio, fechaFin) {
    const inicio = new Date(fechaInicio + 'T00:00:00');
    const fin = new Date(fechaFin + 'T00:00:00');
    if (isNaN(inicio) || isNaN(fin)) {
        return 0;
    }
    if (inicio > fin) {
        return 0;
    }
    let diasHabiles = 0;
    const actual = new Date(inicio);
    while (actual <= fin) {
        const dia = actual.getDay(); 
        if (dia !== 0 && dia !== 6) {
            diasHabiles++;
        }
        actual.setDate(actual.getDate() + 1);
    }
    return diasHabiles;
};

function esFechaDeEsteAnio(fecha) {
    if (!fecha) return false;
    const f = new Date(fecha);
    if (isNaN(f.getTime())) return false;
    const anioActual = new Date().getFullYear();
    return f.getFullYear() === anioActual;
};

function diasEntreFechas(fechaInicio, fechaFin = new Date()) {
    if (!fechaInicio) return null;
    const f1 = new Date(fechaInicio);
    const f2 = new Date(fechaFin);
    if (isNaN(f1.getTime()) || isNaN(f2.getTime())) {
        return null;
    }
    f1.setHours(0, 0, 0, 0);
    f2.setHours(0, 0, 0, 0);

    const diffMs = f2 - f1;
    return Math.floor(diffMs / (1000 * 60 * 60 * 24));
};

function diasTotalesEntreFechas(fechaInicio, fechaFin = new Date()) {
    if (!fechaInicio) return null;
    const f1 = new Date(fechaInicio);
    const f2 = new Date(fechaFin);
    if (isNaN(f1.getTime()) || isNaN(f2.getTime())) {
        return null;
    }
    f1.setHours(0, 0, 0, 0);
    f2.setHours(0, 0, 0, 0);
    const diffMs = f2 - f1;
    return Math.floor(diffMs / (1000 * 60 * 60 * 24)) + 1;
};

function diferenciaEnAnios(fechaInicio = new Date(), fechaFin = new Date()) {
    const start = new Date(fechaInicio);
    const end = new Date(fechaFin);
    let years = end.getFullYear() - start.getFullYear();
    const mesNoHaLlegado = end.getMonth() < start.getMonth();
    const diaNoHaLlegado = end.getMonth() === start.getMonth() && end.getDate() < start.getDate();
    if (mesNoHaLlegado || diaNoHaLlegado) {
        years--;
    }
    return years;
};

function sumarDias(fecha, dias = 0) {
    if (fecha === undefined || fecha === null) {
        return new Date();
    }
    let fechaBase;
    if (fecha instanceof Date) {
        fechaBase = new Date(fecha);
    }
    else if (typeof fecha === 'number') {
        fechaBase = new Date(fecha);
    }
    else if (typeof fecha === 'string') {
        const parsed = new Date(fecha);
        if (isNaN(parsed.getTime())) {
            return new Date();
        }   
        fechaBase = parsed;
    }
    else {
        return new Date();
    }
    if (isNaN(fechaBase.getTime())) {
        return new Date();
    }
    const resultado = new Date(fechaBase);
    resultado.setDate(resultado.getDate() + Number(dias)); 
    return resultado;
};

function sumarMeses(fecha, meses = 0) {
    if (fecha === undefined || fecha === null) {
        return new Date();
    }

    let fechaBase;

    if (fecha instanceof Date) {
        fechaBase = new Date(fecha);
    } else if (typeof fecha === 'number') {
        fechaBase = new Date(fecha);
    } else if (typeof fecha === 'string') {
        const parsed = new Date(fecha);

        if (isNaN(parsed.getTime())) {
            return new Date();
        }

        fechaBase = parsed;
    } else {
        return new Date();
    }

    if (isNaN(fechaBase.getTime())) {
        return new Date();
    }
    const resultado = new Date(fechaBase);
    const diaOriginal = resultado.getDate();
    resultado.setDate(1);
    resultado.setMonth(
        resultado.getMonth() + Number(meses)
    );
    const ultimoDiaMes = new Date(
        resultado.getFullYear(),
        resultado.getMonth() + 1,
        0
    ).getDate();
    resultado.setDate(
        Math.min(diaOriginal, ultimoDiaMes)
    );
    return resultado;
};

function obtenerSemanaISO(fecha) {
    const f = new Date(Date.UTC(fecha.getFullYear(), fecha.getMonth(), fecha.getDate()));
    f.setUTCDate(f.getUTCDate() + 4 - (f.getUTCDay() || 7));
    const inicioAnio = new Date(Date.UTC(f.getUTCFullYear(), 0, 1));
    const numeroSemana = Math.ceil((((f - inicioAnio) / 86400000) + 1) / 7);  
    return numeroSemana;
};

function fechaEsHoy(fecha) {
    if (!fecha) return false;
    const fechaF = new Date(fecha);
    if (isNaN(fechaF.getTime())) return false;
    const hoy = new Date();
    return (
        fechaF.getFullYear() === hoy.getFullYear() &&
        fechaF.getMonth() === hoy.getMonth() &&
        fechaF.getDate() === hoy.getDate()
    );
};

function fechaEsMenorA(fecha, fechaComparar) {
    if (!fecha || !fechaComparar) return false;

    const f1 = new Date(fecha);
    const f2 = new Date(fechaComparar);

    // ❗ Validar fechas inválidas
    if (isNaN(f1.getTime()) || isNaN(f2.getTime())) return false;

    return (
        f1.getFullYear() < f2.getFullYear() ||
        (f1.getFullYear() === f2.getFullYear() && f1.getMonth() < f2.getMonth()) ||
        (f1.getFullYear() === f2.getFullYear() &&
            f1.getMonth() === f2.getMonth() &&
            f1.getDate() < f2.getDate())
    );
};

function formatearHora(valor) {
    if (!valor) return null;
    if (valor instanceof Date && !isNaN(valor.getTime())) {
        const hh = valor.getHours().toString().padStart(2, '0');
        const mm = valor.getMinutes().toString().padStart(2, '0');
        const ss = valor.getSeconds().toString().padStart(2, '0');
        return `${hh}:${mm}:${ss}`;
    }
    if (typeof valor === 'string') {
        let str = valor.trim();
        if (/^\d{1,2}:\d{2}$/.test(str)) {
            const [h, m] = str.split(':');
            return `${h.padStart(2, '0')}:${m}:00`;
        }
        if (/^\d{1,2}:\d{2}:\d{2}$/.test(str)) {
            const [h, m, s] = str.split(':');
            return `${h.padStart(2, '0')}:${m}:${s}`;
        }
        if (/^\d{4}$/.test(str)) {
            return `${str.slice(0,2)}:${str.slice(2)}:00`;
        }
        return null;
    }
    if (typeof valor === 'number' && valor >= 0 && valor <= 2359) {
        const horas = Math.floor(valor / 100).toString().padStart(2, '0');
        const minutos = (valor % 100).toString().padStart(2, '0');
        return `${horas}:${minutos}:00`;
    }
    return null;
};

function toISOStringSafe(fecha) {
    if (!fecha) return null;
    let dateObj;
    if (fecha instanceof Date) {
        dateObj = fecha;
    } else if (typeof fecha === 'string' || typeof fecha === 'number') {
        dateObj = new Date(fecha);
    } else {
        return null;
    }
    if (isNaN(dateObj.getTime())) {
        return null;
    }
    return dateObj.toISOString();
};

function crearFecha(fecha, hora = null) {
    if (!fecha) return null;
    let date;
    if (fecha instanceof Date && !isNaN(fecha.getTime())) {
        date = new Date(fecha); 
    } 
    else if (typeof fecha === 'string') {
        date = new Date(fecha);
        if (isNaN(date.getTime())) return null;
    } 
    else {
        return null;
    }
    if (hora && typeof hora === 'string') {
        const horaRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
        if (!horaRegex.test(hora)) {
            console.warn('Hora inválida:', hora);
            return null;
        }
        
        const [hours, minutes] = hora.split(':').map(Number);
        date.setHours(hours, minutes, 0, 0);
    } 
    else {
        date.setHours(0, 0, 0, 0);
    }
    return date;
};

module.exports = { diasHabilesEntreFechas, diferenciaEnAnios, sumarDias, obtenerSemanaISO, diasEntreFechas, 
    diasTotalesEntreFechas, fechaEsHoy, fechaEsMenorA, esFechaDeEsteAnio, formatearHora, toISOStringSafe,
    diasHabilesYSabadoEntreFechas, sumarMeses, crearFecha
};