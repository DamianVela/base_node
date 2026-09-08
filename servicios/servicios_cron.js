const cron = require("node-cron");

//PRUEBA
const prueba = cron.schedule('28 4 * * *', () => { console.log('HOLA') });

module.exports = {
    prueba
};