const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Serve static files from the 'public' folder
app.use(express.static('public'));

// Socket.io setup
io.on('connection', (socket) => {
    console.log('A user connected');

    // Handle location updates
    socket.on('locationUpdate', (locationData) => {
        // Process and store location data as needed
        // Broadcast the location data to other connected clients
        socket.broadcast.emit('locationUpdate', locationData);
    });

    // Handle disconnection
    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

// Start the server
server.listen(3000, () => {
    console.log('Server running on port 3000');
});
