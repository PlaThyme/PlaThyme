const express = require("express");
const path = require("path");
const cors = require("cors");
const PORT = process.env.PORT || 3001;
const app = express();
const http = require("http").createServer(app);
const TestGame = require("./Games/TestGame");
const DrawTheWord = require("./Games/DrawTheWord");
const { makeid } = require("./makeid");
const {
  joinRoom,
  leaveRoom,
  getUser,
  getGameId,
  numUsersInRoom,
  getUsersInRoom,
} = require("./rooms.js");

const games = {};

//Get sockets running
const io = require("socket.io")(http);

//Upon connection, log the fact, emit nothing.
io.on("connection", (socket) => {

  console.log("Client Connected");

  socket.on("newRoom", (data) => handleCreateGame(data));
  socket.on("leaveRoom", () => leaveRoom(socket.id));   
  socket.on("messageSend", (message) => handleMessageSend(message));
  socket.on("leaveGame", () => handleDisconnect());
  socket.on("disconnect", () => handleDisconnect());
  socket.on("joinGame", ({ name, roomCode }, callback) => {
    const gid = getGameId(roomCode);

    //Make sure game room exists.
    if (gid === null) {
      socket.emit("error", { error: "gid" });
    }

    //Try to join the user to the room.
    let error = joinRoom({
      id: socket.id,
      gameId: gid,
      name: name,
      roomCode: roomCode,
    });

    //Check for duplicate user.
    if (error.error === "dup") {
      socket.emit("error", { error: "dup" });
    }
    
    //If the user name is valid, join the player to the room, aand
    if (error.error !== "dup" && error.error !== "dup") {
      socket.broadcast.to(roomCode).emit("message", {
        sender: "",
        text: `"${name}" has joined the game.`,
      });

      const gameData = { playerName: name, code: roomCode, gameId: gid };
      socket.emit("gameData", gameData);
      socket.join(roomCode);

      games[roomCode].newPlayer(name)

      //Send all players updated user list.
      io.to(roomCode).emit("userData", getUsersInRoom(roomCode));
    }
  });
  socket.on('game-data', (data) =>{
    games[getUser(socket.id).roomCode].recieveData(data);
  });


  //Below to be removed
  //////////////
  // socket.on('canvas-data', (data) => {
  //   const senderId = getUser(socket.id);
  //   io.to(senderId.roomCode).emit('canvas-data', data);
  // });
  // socket.on('clear-canvas-data', (data) => {
  //   const senderId = getUser(socket.id);
  //   io.to(senderId.roomCode).emit('clear-canvas-data', data);
  // });
  // socket.on('bg-colour-change', (data) => {
  //   const roomCode = getUser(socket.id).roomCode;
  //   games[roomCode].recieveData(data);
  // })
  /////////////
    
  const handleDisconnect = () => {
    const userName = leaveRoom(socket.id);
    if (userName) {
      io.to(userName.roomCode).emit("message", {
        sender: "",
        text: `"${userName.name}" left the game.`,
      });
      //Send all players updated user list.
      io.to(userName.roomCode).emit("userData", getUsersInRoom(userName.roomCode));
      games[userName.roomCode].disconnection(userName.name)
    }
    //TODO: If going with game API, make this delete empty game.
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


    //When Making a game, the game must be added to the list below for its creation with its matching ID.
    //Create a new game object for the selected game, and call its start game function.
    if(data.gameId === 1){
      games[roomCode] = new DrawTheWord(roomCode, socket, io, [data.name]);
    }
    if(data.gameId === 2){
      games[roomCode] = new TestGame(roomCode, socket, io, [data.name]);
    }
    games[roomCode].startGame();

    //Send all players updated user list.
    io.to(roomCode).emit("userData", getUsersInRoom(roomCode));
  }

  const handleMessageSend = (message) => {
    const senderId = getUser(socket.id);
    games[senderId.roomCode].chatMessage({sender:message.sender,text:message.text});
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
