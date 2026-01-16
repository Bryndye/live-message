const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const { Events } = require("./src/enums");
const User = require("./src/user");

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 3000;

// anti xss

const io = new Server(server);
const users = new Map();

app.use(express.static(__dirname));
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

// Pour envoyer un message à tous les clients
function sendMessageToAll(socket, message) {
  try{
    messageEscaped = escapeHtml(message);
    const user = users.get(socket.id);
    io.emit(Events.MESSAGE, user.name + ": " + messageEscaped);
  }  catch(err){
    console.error("Error sending message to all:", err);
  }
}

// ASTUCES
// Pour envoyer un message à tous les clients sauf le client qui a envoyé le message
// socket.broadcast.emit(Events.MESSAGE, `serveur: ${msg}`);

// Pour envoyer un message au client qui a envoyé le message
// socket.emit(Events.MESSAGE, `serveur: ${msg}`);

function escapeHtml(str) {
  return String(str)
    .replace(/<script>/g, "")
    .replace(/<\/script>/g, "")
    .replace(/<link>/g, "")
    .replace(/<\/link>/g, "")}

io.on(Events.CONNECT, (socket) => {
  console.log("client connecté", socket.id);

  socket.on(Events.MESSAGE, (msg) => {
    console.log("reçu:", socket.id, msg);
    sendMessageToAll(socket, msg);
  });

  socket.on(Events.USER_DISCONNECTED, (user=null) => {
    console.log("client déconnecté", socket.id);
    if (user !== null) {
      socket.broadcast.emit(Events.MESSAGE, `${user.name} vient de se déconnecter !`);
    }
    else {
      socket.broadcast.emit(Events.MESSAGE, `${socket.id} vient de se déconnecter !`);
    }
    users.delete(socket.id);
  });

  socket.on(Events.USER_ID, (user) => {
    console.log("user id:", user);
    users.set(socket.id, user);
    socket.broadcast.emit(Events.USER_CONNECTED, `${user.name} vient de se connecter !`);
    socket.emit(Events.USER_CONNECTED, `Vous êtes connectés en tant que : ${user.name}`);
  });
});

server.listen(PORT, () => {
  console.log("Listening", PORT);
});
