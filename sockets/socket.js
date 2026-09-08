const { setIO } = require('./socketManager');

module.exports = (io) => {
    setIO(io);
    io.on('connection', (socket) => {
        socket.on('disconnect', () => {
            console.log('Cliente desconectado:', socket.id);
        });

        socket.on("join-room", (room) => {
            socket.join(room);
        });

        socket.on("chat-message", (data) => {
            const { room, mensaje } = data;
            io.to(room).emit("chat-message", { mensaje });
        });

        socket.on("leave-room", (room) => {
            socket.leave(room);
        });
    });
};