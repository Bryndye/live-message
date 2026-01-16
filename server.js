const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const allowedOrigin = process.env.CORS_ORIGIN || "http://localhost:3000";
const PORT = process.env.PORT || 3000;

const io = new Server(server);
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

  socket.on("message", (msg) => {
    console.log("reçu:", msg);
    // Pour envoyer un message au client qui a envoyé le message
    // socket.emit("message", `serveur: ${msg}`);

    // Pour envoyer un message à tous les clients
    io.emit("message", `serveur: ${msg}`);

    // Pour envoyer un message à tous les clients sauf le client qui a envoyé le message
    // socket.broadcast.emit("message", `serveur: ${msg}`);
  });

  socket.on("disconnect", () => {
    console.log("client déconnecté");
  });
});

server.listen(PORT, () => {
  console.log("Listening", PORT);
});
