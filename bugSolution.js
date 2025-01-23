const http = require('http');

const requestListener = (request, response) => {
  try {
    response.writeHead(200);
    response.end('Hello, World!');
  } catch (error) {
    console.error('Error handling request:', error);
    response.writeHead(500);
    response.end('Internal Server Error');
  }
};

const server = http.createServer(requestListener);

// Implement graceful restart
let serverInstance = server;
function restartServer() {
  if (serverInstance) {
    serverInstance.close(() => {
      console.log('Server closed gracefully.');
      serverInstance = http.createServer(requestListener);
      serverInstance.listen(8080, () => {
        console.log('Server restarted on port 8080.');
      });
    });
  } else {
    console.log('Server is not running.');
  }
}

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  restartServer();
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  restartServer();
});

server.listen(8080, () => {
  console.log('Server listening on port 8080');
});