const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

// #region agent log
const __dbg = (location, message, data, hypothesisId, runId = "run1") => {
  try {
    fetch("http://127.0.0.1:7243/ingest/8ea630b1-80ec-4337-a908-83d4377b32ed", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId: "debug-session",
        runId,
        hypothesisId,
        location,
        message,
        data,
        timestamp: Date.now(),
      }),
    }).catch(() => {});
  } catch (_) {}
};
// #endregion

const app = express();
const server = http.createServer(app);
const allowedOrigin = process.env.CORS_ORIGIN || "http://localhost:3000";
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log("Listening", PORT));

// #region agent log
__dbg(
  "server.js:startup",
  "startup config",
  { PORT, allowedOrigin, envPort: process.env.PORT || null, envCors: process.env.CORS_ORIGIN || null },
  "H1"
);
server.on("listening", () => {
  __dbg("server.js:listening", "server listening", { address: server.address() }, "H1");
});
server.on("error", (err) => {
  __dbg("server.js:server-error", "server error", { code: err && err.code, message: err && err.message }, "H4");
});
// #endregion

const io = new Server(server);
// {
//   cors: {
//     origin: allowedOrigin,
//     methods: ["GET", "POST"],
//     credentials: true,
//   },
// }

// #region agent log
__dbg("server.js:io-init", "io initialized", { corsOrigin: allowedOrigin }, "H2");
// #endregion

// #region agent log
app.use((req, res, next) => {
  if (req.url.includes("socket")) {
    __dbg(
      "server.js:req",
      "socket-related request",
      {
        method: req.method,
        url: req.url,
        host: req.headers.host,
        origin: req.headers.origin,
      },
      "H3"
    );
  }
  next();
});
// #endregion

app.use(express.static(__dirname));

io.on("connection", (socket) => {
  console.log("client connecté", socket.id);
  // #region agent log
  __dbg(
    "server.js:io-connection",
    "socket connected",
    { id: socket.id, origin: socket.handshake && socket.handshake.headers && socket.handshake.headers.origin },
    "H2"
  );
  // #endregion

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
  console.log("http://localhost:3000");
});
