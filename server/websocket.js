const WebSocket = require('ws');

const createWebSocketServer = () => {
  const wss = new WebSocket.Server({port: 8001});

  // Handle WebSocket connections
  wss.on('connection', (ws, req) => {
    console.log(`New WebSocket connection for game ${req.url}`);
    ws.send(JSON.stringify({
          type: 'welcome',
          message: `Connected to websocket server`,
        }));
  });

  return wss;
};

module.exports = createWebSocketServer;