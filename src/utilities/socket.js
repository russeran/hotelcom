import { io } from 'socket.io-client';
import { getToken } from './users-service';

let socket = null;

// Connect (or reconnect with a fresh token). Safe to call repeatedly.
export function connectSocket() {
    const token = getToken();
    if (socket) {
        socket.auth = { token };
        if (!socket.connected) socket.connect();
        return socket;
    }
    socket = io({
        path: '/socket.io',
        auth: { token },
        autoConnect: true,
        transports: ['websocket', 'polling'],
    });
    return socket;
}

export function disconnectSocket() {
    if (socket) {
        socket.disconnect();
        socket = null;
    }
}

// Subscribe to an event; returns an unsubscribe function.
export function onSocket(event, handler) {
    const s = connectSocket();
    s.on(event, handler);
    return () => s.off(event, handler);
}
