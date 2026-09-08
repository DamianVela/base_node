function erroresDuplicados(error) {
    let mensaje = 'Error interno del servidor';
    if (!error) {
        return mensaje;
    }
    switch (error.name) {
        case 'SequelizeUniqueConstraintError': {
            let columnasDuplicadas = 'campo desconocido';
            let valorDuplicado = '';
            if (error.fields && typeof error.fields === 'object') {
                columnasDuplicadas = Object.keys(error.fields).join(', ');
            }
            else if (Array.isArray(error.errors)) {
                columnasDuplicadas = error.errors
                    .map(e => e.path || 'desconocido')
                    .join(', ');
            }
            const mensajeSQL =
                error.parent?.message ||
                error.original?.message ||
                '';
            const match = mensajeSQL.match(
                /duplicate key value is\s*\((.*?)\)|duplicate entry\s*'(.*?)'/i
            );
            if (match) {
                valorDuplicado = match[1] || match[2] || '';
            }
            mensaje =
                `Duplicado en ${columnasDuplicadas}` +
                (valorDuplicado ? `\nValor: ${valorDuplicado}` : '') +
                `\nYa existe un registro con este valor.`;
            break;
        }
        case 'SequelizeValidationError': {
            mensaje = error.errors
                ?.map(e => `${e.path}: ${e.message}`)
                .join(', ') || error.message;
            break;
        }
        case 'SequelizeForeignKeyConstraintError': {
            mensaje = 'No se puede realizar la operación porque existen registros relacionados.';
            break;
        }
        case 'SequelizeDatabaseError': {
            mensaje = error.parent?.message || error.message;
            break;
        }
        case 'SequelizeConnectionError':
        case 'SequelizeConnectionRefusedError':
        case 'SequelizeHostNotFoundError':
        case 'SequelizeAccessDeniedError': {
            mensaje = 'Error de conexión con la base de datos.';
            break;
        }
        case 'SequelizeTimeoutError': {
            mensaje = 'Tiempo de espera agotado en la base de datos.';
            break;
        }
        default: {
            mensaje =
                error.message ||
                error.parent?.message ||
                'Error desconocido';
            break;
        }
    }
    return mensaje;
};

async function rollbackTransaction(transaction, contexto = '') {
    try {
        if (!transaction) {
            return false;
        }
        if (transaction.finished) {
            return false;
        }
        await transaction.rollback();
        return true;
    } catch (error) {
        return false;
    }
};

module.exports = { erroresDuplicados, rollbackTransaction };