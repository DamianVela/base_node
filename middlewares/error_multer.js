const multer = require('multer');

exports.handleMulterError = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(413).json({
                error: 'El archivo es demasiado grande. El tamaño máximo permitido es 7 MB.'
            });
        }
        return res.status(400).json({
            error: `Error en la subida del archivo: ${err.message}`
        });
    }
    next(err);
};