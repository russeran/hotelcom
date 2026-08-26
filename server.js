const http = require('http');
const io = require('./config/io');

require('dotenv').config()
require('./config/database')

const app = require('./app');

// Configure to use port 3001 instead of 3000 during
// development to avoid collision with React's dev server
const port = process.env.PORT || 3001;

// Wrap Express in an HTTP server so socket.io can share the port for real-time
// chat and notification events.
const server = http.createServer(app);
io.init(server);

server.listen(port, function() {
    console.log(`Express app running on port ${port} (with real-time socket.io)`)
});
