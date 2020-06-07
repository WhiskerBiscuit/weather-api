// Import dependencies
const http = require('http');
const nodeStatic = require('node-static');
const url = require('url');
const routes = require('./server/routes');

// Initialize server details
const hostname = '127.0.0.1';
const port = 8080;

// Set up a static file server to serve up production assets
const fileServer = new nodeStatic.Server('./build');

// Create server
const server = http.createServer((req, res) => {
    // Get the URL path
    const { pathname } = url.parse(req.url, true);

    // Get the route handler
    const route = routes[pathname];

    // Handle static resources
    if (pathname.includes('/static/')) {
        req.addListener('end', () => {
            fileServer.serve(req, res);
        }).resume();
    }

    // Handle valid routes
    else if (route) {
        route(req, res);
    }

    // Handle invalid routes
    else {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'text/html');
        res.end('NOT FOUND');
    }
});

// Fire up the server and listen for requests
server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
