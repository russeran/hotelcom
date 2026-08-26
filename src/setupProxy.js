const { createProxyMiddleware } = require('http-proxy-middleware');

// When this file exists, CRA uses it instead of the package.json "proxy"
// field, so it must forward everything the app needs — including the
// socket.io websocket upgrade for real-time chat/notifications.
module.exports = function (app) {
    const target = 'http://localhost:3001';
    app.use('/api', createProxyMiddleware({ target, changeOrigin: true }));
    app.use('/uploads', createProxyMiddleware({ target, changeOrigin: true }));
    app.use('/socket.io', createProxyMiddleware({ target, changeOrigin: true, ws: true }));
};
