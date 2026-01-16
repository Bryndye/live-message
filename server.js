const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const { Events } = require("./enums");
const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 3000;

// anti xss

const io = new Server(server);
// const allowedOrigin = process.env.CORS_ORIGIN || "http://localhost:3000";
// {
//   cors: {
//     origin: allowedOrigin,
//     methods: ["GET", "POST"],
//     credentials: true,
//   },
// }

app.use(express.static(__dirname));

io.on("connection", (socket) => {
  console.log("client connecté", socket.id);
  io.emit(Events.USER_CONNECTED, `serveur: ${socket.id} connecté`);

  socket.on(Events.MESSAGE, (msg) => {
    console.log("reçu:", msg);
    // Pour envoyer un message au client qui a envoyé le message
    // socket.emit(Events.MESSAGE, `serveur: ${msg}`);

    // Pour envoyer un message à tous les clients
    io.emit(Events.MESSAGE, `serveur: ${msg}`);

    // Pour envoyer un message à tous les clients sauf le client qui a envoyé le message
    // socket.broadcast.emit(Events.MESSAGE, `serveur: ${msg}`);
  });

  socket.on(Events.USER_DISCONNECTED, () => {
    console.log("client déconnecté");
  });
});

server.listen(PORT, () => {
  console.log("Listening", PORT);
});
