const PORT = process.env.PORT || 3000;
const INDEX = "/index.html";
const express = require("express");

const server = express()
  .use(express.static("public"))
  .use((req, res) => res.sendFile(INDEX, { root: __dirname }))
  .listen(PORT, () => console.log(`Listening on ${PORT}`));

// const io = require("socket.io")(3000, { cors: {}})

const io = require("socket.io")(server, { cors: {} });

const users = {};

console.log("Server Running");

io.on("connection", function (socket) {
  socket.on("new-user-joined", (name) => {
    users[socket.id] = name;
    socket.broadcast.emit("user-joined", name);
  });

  socket.on("send", function (message) {
    socket.broadcast.emit("recieve", {
      message: message,
      name: users[socket.id],
    });
  });

  socket.on("disconnect", function (message) {
    socket.broadcast.emit("left", users[socket.id]);
    delete users[socket.id];
  });
});
