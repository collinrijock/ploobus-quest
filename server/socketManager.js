const players = {};

function handleSocketConnection(socket, io) {
    console.log('A player connected:', socket.id);

    // Add the new player to the players object
    players[socket.id] = {
        id: socket.id,
        x: Math.floor(Math.random() * 800), // Random spawn position
        y: Math.floor(Math.random() * 600),
    };

    // Send the player data to the client
    socket.emit('currentPlayers', players);

    // Notify other players about the new player
    socket.broadcast.emit('newPlayer', players[socket.id]);

    // Handle player movement
    socket.on('playerMovement', (movementData) => {
        if (players[socket.id]) {
            players[socket.id].x = movementData.x;
            players[socket.id].y = movementData.y;

            // Broadcast the movement to all other players
            socket.broadcast.emit('playerMoved', players[socket.id]);
        }
    });

    // When a player disconnects, remove them from the players object
    socket.on('disconnect', () => {
        console.log('A player disconnected:', socket.id);
        delete players[socket.id];

        // Notify other players that a player has disconnected
        io.emit('playerDisconnected', socket.id);
    });
}

module.exports = { handleSocketConnection };
