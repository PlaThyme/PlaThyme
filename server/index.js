const express = require("express");
const path = require("path");
const cors = require("cors");
const PORT = process.env.PORT || 3001;
const app = express();
const http = require("http").createServer(app);
const { makeid } = require("./makeid");
const {
  joinRoom,
  leaveRoom,
  getUser,
  getGameId,
  numUsersInRoom,
  getUsersInRoom,
} = require("./rooms.js");

//Get sockets running
const io = require("socket.io")(http);

//Upon connection, log the fact, emit nothing.
io.on("connection", (socket) => {

  console.log("Client Connected");

  socket.emit("message", "yup");

  socket.on("newRoom", (data) => handleCreateGame(data));
  socket.on("leaveRoom", () => leaveRoom(socket.id));   
  socket.on("messageSend", (message) => handleMessageSend(message));
  socket.on("leaveGame", () => handleDisconnect());
  socket.on("disconnect", () => handleDisconnect());
  socket.on("joinGame", ({ name, roomCode }, callback) => {
    const gid = getGameId(roomCode);
    if (gid === null) {
      socket.emit("error", { error: "gid" });
    }
    let error = joinRoom({
      id: socket.id,
      gameId: gid,
      name: name,
      roomCode: roomCode,
    });
    if (error.error === "dup") {
      socket.emit("error", { error: "dup" });
    }
    if (error.error !== "dup" && error.error !== "dup") {
      socket.broadcast.to(roomCode).emit("message", {
        sender: "",
        text: `"${name}" has joined the game.`,
      });
      io.to(roomCode).emit("userData", getUsersInRoom(roomCode));

      const gameData = { playerName: name, code: roomCode, gameId: gid };
      socket.emit("gameData", gameData);
      socket.join(roomCode);
    }
  });
  socket.on('canvas-data', (data) => {
    const senderId = getUser(socket.id);
    io.to(senderId.roomCode).emit('canvas-data', data);
  });
  socket.on('clear-canvas-data', (data) => {
    const senderId = getUser(socket.id);
    io.to(senderId.roomCode).emit('clear-canvas-data', data);
  });

  const handleDisconnect = () => {
    const userName = leaveRoom(socket.id);
    if (userName) {
      io.to(userName.roomCode).emit("message", {
        sender: "",
        text: `"${userName.name}" left the game.`,
      });
    }
  }  

  const handleCreateGame = (data) => {
    roomCode = makeid(6);

    //Check if the random ID was a repeat. If so, recursively attempt again.
    if (numUsersInRoom(roomCode) > 0) {
      handleCreateGame(data);
      return;
    }

    const gameData = {
      playerName: data.name,
      code: roomCode,
      gameId: data.gameId,
    };

    //Adds user to room tracking.
    let error = joinRoom({
      id: socket.id,
      name: data.name,
      gameId: data.gameId,
      roomCode: roomCode,
    });

    if (error.error === "dup") {
      socket.emit("error", { error: "dup" });
    }

    socket.emit("gameData", gameData);
    socket.join(roomCode);
  }

  const handleMessageSend = (message) => {
    const senderId = getUser(socket.id);
    io.to(senderId.roomCode).emit("message", {
      sender: message.sender,
      text: message.text,
    });
  }
});

http.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

app.use(express.static(path.resolve(__dirname, "../client/build")));
