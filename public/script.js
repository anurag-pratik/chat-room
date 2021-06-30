// const socket = io("http://localhost:3000", {reconnect: true});
const socket = io();
const form = document.getElementById("send-container");
const messageInput = document.getElementById("msgInp");
const messageContainer = document.querySelector(".container-fluid");

var name = "";

while (name == "") {
  name = prompt("Please enter your name to join the ChatRoom");
}

var pop = new Audio("pop.mp3");

const append = (message, position) => {
  const msgElement = document.createElement("div");
  msgElement.innerText = message;
  msgElement.classList.add("message");
  msgElement.classList.add(position);
  if (position == "left") pop.play();
  messageContainer.append(msgElement);
};

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const message = messageInput.value;
  append("You: " + message, "right");
  socket.emit("send", message);
  messageInput.value = "";
  messageContainer.scrollTop = messageContainer.scrollHeight;
});

socket.emit("new-user-joined", name);

socket.on("user-joined", (name) => {
  append(name + " joined the room", "left");
});

socket.on("recieve", (data) => {
  append(data.name + ": " + data.message, "left");
});

socket.on("left", (name) => {
  append(name + " left the room", "left");
});
