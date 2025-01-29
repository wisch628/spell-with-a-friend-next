const WebSocket = require('ws');

const createWebSocketServer = (httpServer) => {
  const wss = new WebSocket.Server({ server: httpServer });

  // Handle WebSocket connections
  wss.on('connection', (ws) => {
    ws.send(JSON.stringify({
          type: 'welcome',
          message: `Connected to websocket server`,
        }));
  });

  return wss;
};

module.exports = createWebSocketServer;