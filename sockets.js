

module.exports = io => {
    console.log("io module");
    io.on('connection', (socket) => {
        console.log('A user connected', socket.id);
        socket.emit("id", socket.id);

        socket.on('disconnect', () => {
            console.log('User disconnected');
        });

        socket.on('test_message', (msg) => {
            console.log('Message:', msg);
        });
    });
}