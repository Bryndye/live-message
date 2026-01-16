const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const { Events } = require("./enums");
const User = require("./user");

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 3000;

// anti xss

const io = new Server(server);
const users = new Map();

app.use(express.static(__dirname));

// Pour envoyer un message à tous les clients
function sendMessageToAll(socket, message) {
  console.log("user name:", users);
  console.log("user name:", users.get(socket.id));
  console.log("user name:", users.get(socket.id).name);
  const userName = users.get(socket.id).name;
  io.emit(Events.MESSAGE, userName + ": " + message);
}

// ASTUCES
// Pour envoyer un message à tous les clients sauf le client qui a envoyé le message
// socket.broadcast.emit(Events.MESSAGE, `serveur: ${msg}`);

// Pour envoyer un message au client qui a envoyé le message
// socket.emit(Events.MESSAGE, `serveur: ${msg}`);

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
// const safe = escapeHtml(userInput);

io.on(Events.CONNECT, (socket) => {
  console.log("client connecté", socket.id);

  socket.on(Events.MESSAGE, (msg) => {
    console.log("reçu:", msg);

    sendMessageToAll(socket, msg);
  });

  socket.on(Events.USER_DISCONNECTED, (user=null) => {
    console.log("client déconnecté", socket.id);
    if (user !== null) {
      socket.broadcast.emit(Events.USER_DISCONNECTED, `${user.name} vient de se déconnecter !`);
    }
    else {
      socket.broadcast.emit(Events.USER_DISCONNECTED, `${users.get(socket.id).name} vient de se déconnecter !`);
    }
    users.delete(socket.id);
  });

  socket.on(Events.USER_ID, (user) => {
    console.log("user id:", user);
    users.set(socket.id, user);
    socket.broadcast.emit(Events.USER_CONNECTED, `${user.name} vient de se connecter !`);
  });
});

server.listen(PORT, () => {
  console.log("Listening", PORT);
});
