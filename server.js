const express = require("express");
const http = require("http");
const helmet = require("helmet");
const path = require("path");

const { Server } = require("socket.io");
const { Events } = require("./src/enums");
const { escapeHtml } = require("./src/antixss");
const User = require("./src/user");

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 3000;

const io = new Server(server);

app.disable("x-powered-by");

app.use(express.static(__dirname));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

const users = {};

// Pour envoyer un message à tous les clients
function sendMessageToAll(socket, message) {
  try{
    messageEscaped = escapeHtml(message);
    if (messageEscaped.trim() === "") {
      const address = socket.handshake.address;
      console.log('This user tried to use a non conform balise : ' + address.address + ':' + address.port);
      socket.emit(Events.MESSAGE, "<b style=\"color:red\">serveur: Votre message contient des balises non autorisées et a été ignoré.</b>");
      return;
    }
    const user = users[socket.id];
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

io.on("connect", (socket) => {
  console.log("client connecté", socket.id);
  
  socket.on(Events.MESSAGE, (msg) => {
    console.log("reçu:", socket.id, msg);
    if (typeof msg !== "string") {
      console.error("Message non valide reçu:", msg);
      return;
    }
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
    delete users[socket.id];
  });

  socket.on(Events.USER_ID, (user) => {
    console.log("user id:", user);
    users[socket.id] = user;
    socket.broadcast.emit(Events.USER_CONNECTED, `${user.name} vient de se connecter !`);
    socket.emit(Events.USER_CONNECTED, `Vous êtes connectés en tant que : ${user.name}`);
  });
});

server.listen(PORT, () => {
  console.log("Listening", PORT);
});