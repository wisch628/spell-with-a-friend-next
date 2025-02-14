const { createServer } = require("http");
const { parse } = require("url");
const next = require("next");
const { Server } = require("socket.io");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  });
  if (!global.io) {
    global.io = new Server(server);

    global.io.on("connection", (socket) => {
      console.log("A client connected");
      
      socket.on('joinGame', (game) => {
        console.log(`Client joined game: ${game}`);
        socket.join(game);
        socket.emit('joinedGame', `You have joined game ${game}`);
      });

      socket.on("disconnect", () => {
        console.log("A client disconnected");
      });
    });
  }

  server.listen(3000, (err) => {
    if (err) throw err;
    console.log("> Ready on http://localhost:3000");
  });
});
