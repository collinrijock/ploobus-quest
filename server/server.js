const express = require('express');
const path = require('path');
const http = require('http');
const socketio = require('socket.io');
const { handleSocketConnection } = require('./socketManager');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const PORT = process.env.PORT || 3000;

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, '../public')));

// Handle socket connections
io.on('connection', (socket) => {
    handleSocketConnection(socket, io);
});

// Start the server
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
