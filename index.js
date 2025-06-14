const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const PORT = process.env.PORT || 3000;

// Serve a simple homepage for testing
app.get('/', (req, res) => {
    res.send('<h1>Signaling Server is Running!</h1>');
});

// Handle WebSocket connections
io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('chatMessage', (message) => {
        console.log(`Message received: ${message}`);
        io.emit('chatMessage', message); // Broadcast to all users
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

// Start the server
server.listen(PORT, () => {
    console.log(`Signaling server running on http://localhost:${PORT}`);
});
