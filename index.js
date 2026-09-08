//IMPORTAR LIBRERÍAS 
const cors = require('cors');
const express = require('express');
const sequelize = require('./config/db');
const app = express();
require('dotenv').config();

const http = require('http'); 
const { Server } = require('socket.io');

//MIDDLEWARES
const middlewares = require('./middlewares');
const { autenticaciones, apilimiters } = middlewares;

//RUTAS
const personal = require('./rutas/principales/personal');
const seguridad = require('./rutas/principales/seguridad');

//PUERTO
const port = process.env.PORT || 5001;

//SOCKETS
const setupSockets = require('./sockets/socket');
const cookieParser = require('cookie-parser');

//TESTING
const morgan = require('morgan');
app.use(morgan("dev"));

const jobs = Object.values(require("./servicios/servicios_cron"));
jobs.forEach(job => job.start());

//CONEXIÓN
const server = http.createServer(app); 
const io = new Server(server, { 
    cors: {
        origin: process.env.CORS_URL || "*",
        credentials: true
    }
});

//ACTIVAR SOCKET
app.use(cookieParser());
autenticaciones.socket_autenticacion(io);
setupSockets(io);

//ADMITIR REQUESTS DE ORIGEN DE LA LIGA
app.use(cors({
    origin: [process.env.CORS_URL, process.env.CUSTOM_DOMAIN],
    credentials: true
}));

//API LIMITER
app.use(apilimiters.apiLimiter);

//EXPRESS JSON
app.use(express.json());

//SINCRONIZAR BASE DE DATOS
sequelize.authenticate()
    .then(() => {
        console.log('Database synced');
    })
    .catch(err => {
        console.error('Error syncing database:', err);
});

//INICIALIZAR
server.listen(port, () => {
    console.log(`API y Socket.io corriendo en http://localhost:${port}`);
});

//PÁGINA PRINCIPAL
app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>DAMIAN</title>
        </head>
            <body>
                <h1 style="text-align: center; color: purple;">
                    Hola Mundo, soy la api de damián. P1
                </h1>
            </body>
        </html>
    `);
});

//ENDPOINTS RUTAS
//PERSONAL
app.use('/personal', personal);

//SEGURIDAD
app.use('/seguridad', seguridad);