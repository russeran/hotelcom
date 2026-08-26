require('express-async-errors');
const express = require('express');
const fs = require('fs');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const helmet = require('helmet');

require('dotenv').config()
require('./config/database')

const app = express();

//
app.use(logger('dev'));
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

// Configure to use port 3001 instead of 3000 during
// development to avoid collision with React's dev server
const port = process.env.PORT || 3001;

app.listen(port, function() {
    console.log(`Express app running on port ${port}`)
});