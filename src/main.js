const log = (m) => (document.getElementById("log").innerHTML += m + "\n");
const socket = io();
let user = null;

socket.on(Events.CONNECT, () => {
  log("Vous êtes connectés au serveur de chat.\nAttention aux messages malveillants !");
  connectUser();
});
socket.on(Events.MESSAGE, (m) => {
  dateNow = new Date().toLocaleTimeString();
  log(dateNow + " " + m);
  console.log(m);
});
socket.on(Events.USER_CONNECTED, (m) => {
  log(m);
  console.log(m);
  checkUser();
});
socket.on(Events.USER_DISCONNECTED, () => {
  log("déconnecté");
  user = null;
  checkUser();
});

const containerFormUserId = document.getElementById("container-form-user-id");
const chat = document.getElementById("chat");

function connectUser() {
  user = User.getUser(socket.id);
  if (user !== null) {
    socket.emit(Events.USER_ID, user);
  }else{
    checkUser();
    return;
  }
}

// verifier si l'utilisateur a un nom
function checkUser() {
  if (user === null) {
    containerFormUserId.style.display = "block";
    chat.style.display = "none";
  } else {
    containerFormUserId.style.display = "none";
    chat.style.display = "block";
  }
}

// Quand on quitte la page, on déconnecte l'utilisateur
window.addEventListener("beforeunload", () => {
  socket.emit(Events.USER_DISCONNECTED, user);
  if (user !== null) {
    socket.emit(Events.USER_DISCONNECTED, user);
  }
});

// Pour envoyer un message
document.getElementById("send").onclick = () => {
  const elementMsg = document.getElementById("msg");
  const msg = document.getElementById("msg").value;
  socket.emit(Events.MESSAGE, msg);
  elementMsg.value = "";
  document.getElementById("anchor-bottom").scrollIntoView({ behavior: "smooth" });
};

// Pour envoyer un message sans recharger la page
const froms = document.getElementsByTagName("form");
for (const form of froms) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
  });
}

document.getElementById("send-user-id").onclick = () => {
  const elementUserId = document.getElementById("user-id");
  user = new User(socket.id, elementUserId.value);
  User.setUser(user);
  connectUser();
  elementUserId.value = "";
};