const { parse } = require("url");
const next = require("next");
const { createServer } = require("node:http");
const { Server, Socket } = require("socket.io");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handler = app.getRequestHandler();

const context = { io: null };
const clients = new Map();

const requestListener = (req, res) => {
  // Be sure to pass `true` as the second argument to `url.parse`.
  // This tells it to parse the query portion of the URL.
  const parsedUrl = parse(req.url, true);
  req.context = context;
  handler(req, res, parsedUrl);
};

app.prepare().then(() => {
  const port = parseInt(process.env.PORT || "3000", 10);

  const server = createServer(requestListener);

  context.io = new Server(server);
  context.io.on("connect", (socket) => {
    const roomId = socket.handshake?.query?.roomId;
    socket.broadcast.to(roomId).emit("welcome", socket.id);

    const metadata = {
      id: socket.id,
      roomId,
    };

    socket.join(roomId);
    clients.set(socket, metadata);

    socket.on("connect:update_board", (payload) => {
      if (clients.size <= 1) {
        return;
      }

      const { welcomeId, board } = payload;
      const client = clients.get(socket);

      if (!client) {
        return;
      }

      socket.to(welcomeId).emit("update:board_updated", JSON.stringify(board));
    });

    socket.on("update:board", (payload) => {
      const client = clients.get(socket);

      if (!client) {
        return;
      }

      socket.to(client.roomId).emit("update:board_updated", payload);
    });

    socket.on("disconnect", async () => {
      clients.delete(socket);
    });
  });

  server
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://localhost:${port}`);
    });
});
