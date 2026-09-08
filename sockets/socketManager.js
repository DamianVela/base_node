let ioInstance = null;

const setIO = (io) => {
    ioInstance = io;
};

const getIO = () => {
    if (!ioInstance) {
        throw new Error("Socket.IO no ha sido inicializado");
    }
    return ioInstance;
};

const notifyClients = (room, eventName, data = {}) => {
    getIO().to(room).emit(eventName, data);
};

module.exports = {
    setIO,
    getIO,
    notifyClients
};