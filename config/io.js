// Thin holder for the socket.io instance so any controller can emit real-time
// events without a circular dependency on server.js.
const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');

let io = null;

function init(httpServer) {
    io = new Server(httpServer, {
        // Same-origin in prod, and via the CRA dev proxy in development, so no
        // CORS config is required.
        path: '/socket.io'
    });

    // Lightweight auth: verify the JWT presented on connection. Identity isn't
    // strictly required for the broadcast pings, but we reject invalid tokens.
    io.use((socket, next) => {
        const token = socket.handshake.auth && socket.handshake.auth.token;
        if (!token) return next(); // allow anonymous connect; events are non-sensitive pings
        jwt.verify(token, process.env.SECRET, (err, decoded) => {
            if (!err && decoded && decoded.user) {
                socket.user = decoded.user;
            }
            next();
        });
    });

    return io;
}

function emit(event, payload) {
    if (io) io.emit(event, payload);
}

module.exports = { init, emit, get: () => io };
