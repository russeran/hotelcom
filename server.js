const express = require('express');
const fs = require('fs');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');

require('dotenv').config()
require('./config/database')

const app = express();

//
app.use(logger('dev'));
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

app.use(require('./config/checkToken'))

// Put API routes here, before the "catch all" route
app.use('/api/users', require('./routes/api/users'))
app.use('/api/complaints', require('./routes/api/complaints'))
app.use('/api/concierges', require('./routes/api/concierges'))
app.use('/api/notes', require('./routes/api/notes'))
app.use('/api/tasks', require('./routes/api/tasks'))

// The following "catch all" route (note the *) is necessary
// to return the index.html on all non-AJAX requests
app.get('/*', function(req, res) {
    if (buildExists) {
        return res.sendFile(path.join(buildDir, 'index.html'));
    }
    // In development the client is served by the React dev server on port 3000.
    res.status(200).send('API server running in development mode. Open the React dev server (http://localhost:3000).');
});

// Configure to use port 3001 instead of 3000 during
// development to avoid collision with React's dev server
const port = process.env.PORT || 3001;

app.listen(port, function() {
    console.log(`Express app running on port ${port}`)
});