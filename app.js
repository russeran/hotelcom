require('express-async-errors');
const express = require('express');
const fs = require('fs');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const helmet = require('helmet');

// The configured Express app WITHOUT starting a listener or connecting to the
// database. server.js wires DB + socket.io + listen for production/dev; tests
// import this app directly (with their own DB) via supertest.
const app = express();

if (process.env.NODE_ENV !== 'test') {
    app.use(logger('dev'));
}
// Security headers. CSP/CORP are relaxed so the SPA, Google Fonts, and
// external images (avatars, event posters) load without extra config.
app.use(helmet({ contentSecurityPolicy: false, crossOriginEmbedderPolicy: false, crossOriginResourcePolicy: false }));
app.use(express.json());

// Configure both serve-favicon & static middleware
// to serve from the production 'build' folder.
// In development the React dev server (port 3000) serves the client and
// proxies API requests here, so the 'build' folder won't exist yet.
const buildDir = path.join(__dirname, 'build');
const buildExists = fs.existsSync(path.join(buildDir, 'index.html'));
if (buildExists) {
    app.use(favicon(path.join(buildDir, 'favicon.ico')));
    app.use(express.static(buildDir));
}

// Serve uploaded files (e.g. user profile pictures)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(require('./config/checkToken'))

// Put API routes here, before the "catch all" route
app.use('/api/users', require('./routes/api/users'))
app.use('/api/complaints', require('./routes/api/complaints'))
app.use('/api/concierges', require('./routes/api/concierges'))
app.use('/api/notes', require('./routes/api/notes'))
app.use('/api/tasks', require('./routes/api/tasks'))
app.use('/api/notifications', require('./routes/api/notifications'))
app.use('/api/messages', require('./routes/api/messages'))
app.use('/api/audit', require('./routes/api/audit'))
app.use('/api/events', require('./routes/api/events'))
app.use('/api/rooms', require('./routes/api/rooms'))
app.use('/api/reservations', require('./routes/api/reservations'))
app.use('/api/ai-concierge', require('./routes/api/aiConcierge'))
app.use('/api/hotel-config', require('./routes/api/hotelConfig'))
app.use('/api/guest-profiles', require('./routes/api/guestProfiles'))
app.use('/api/lost-and-found', require('./routes/api/lostAndFound'))
app.use('/api/packages', require('./routes/api/packages'))
app.use('/api/restaurants', require('./routes/api/restaurants'))
app.use('/api/restaurant-reservations', require('./routes/api/restaurantReservations'))
app.use('/api/waitlist', require('./routes/api/waitlist'))
app.use('/api/user-preferences', require('./routes/api/userPreferences'))
app.use('/api/permissions', require('./routes/api/permissions'))

// JSON 404 for unknown API routes (before the SPA catch-all).
app.use('/api/*', function(req, res) {
    res.status(404).json('Not found');
});

// The following "catch all" route (note the *) is necessary
// to return the index.html on all non-AJAX requests
app.get('/*', function(req, res) {
    if (buildExists) {
        return res.sendFile(path.join(buildDir, 'index.html'));
    }
    // In development the client is served by the React dev server on port 3000.
    res.status(200).send('API server running in development mode. Open the React dev server (http://localhost:3000).');
});

// Centralized error handler. With express-async-errors, rejected promises in
// async route handlers land here instead of hanging the request.
// eslint-disable-next-line no-unused-vars
app.use(function(err, req, res, next) {
    console.error('Unhandled error:', err && err.message ? err.message : err);
    if (err && err.name === 'CastError') return res.status(400).json('Invalid id');
    if (err && err.name === 'ValidationError') return res.status(400).json(err.message);
    res.status(500).json('Internal server error');
});

module.exports = app;
