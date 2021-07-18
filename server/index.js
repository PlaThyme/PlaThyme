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

//games is a dict of the game state objects, indexed bt the roomCode.
const games = {};

//Get sockets running
const io = require("socket.io")(http);

//Handle all events related to a socket connection.
io.on("connection", (socket) => {

  console.log("Client Connected");

  //Socket events to handle the various events.
  socket.on("newRoom", (data) => handleCreateGame(data));
  socket.on("leaveRoom", () => leaveRoom(socket.id));   
  socket.on("messageSend", (message) => handleMessageSend(message));
  socket.on("leaveGame", () => handleDisconnect());
  socket.on("disconnect", () => handleDisconnect());
  socket.on("joinGame", ({ name, roomCode }) => handleJoinGame({name, roomCode}));
  socket.on('game-data', (data) =>{games[getUser(socket.id).roomCode].recieveData(data);}); // keep check for roomcode= undefined
  
  
  //Below are the functions to to handle the socket.on events.

  //New game greation.
  const handleCreateGame = (data) => {
    //Generate a random room code.
    roomCode = makeid(6);

    //Check if the random ID was a repeat. If so, recursively attempt again.
    if (numUsersInRoom(roomCode) > 0) {
      handleCreateGame(data);
      return;
    }

    //Build the data to be sent out to the client.
    const gameData = {
      playerName: data.name,
      code: roomCode,
      gameId: data.gameId,
      minPlayers: data.minPlayers,
    };

    //Adds user, game to room tracking.
    let error = joinRoom({
      id: socket.id,
      name: data.name,
      gameId: data.gameId,
      minPlayers: data.minPlayers,
      roomCode: roomCode,
    });

    //Transmit the game info to the client, and join them to the socket channel for the roomCode.
    socket.emit("gameData", gameData);
    socket.join(roomCode);


    //When Making a game, the game must be added to the list below for its creation with its matching ID.
    //Create a new game object for the selected game, and call its start game function.
    if(data.gameId === 1){
      games[roomCode] = new DrawTheWord(roomCode, socket, io, [data.name], data.minPlayers);
      console.log("game object--> ", games[roomCode]);
    }
    if(data.gameId === 2){
      games[roomCode] = new TestGame(roomCode, socket, io, [data.name]);
    }
    //Notify the game object that a new player has joined.
      // games[roomCode].newPlayer(data.name)
    //Notify the new game object that its been started.
    if(games[roomCode].players.length === games[roomCode].minPlayers){
      games[roomCode].startGame();
      socket.emit("start-game", {});
    }


    //Send all players updated user list.
    io.to(roomCode).emit("userData", getUsersInRoom(roomCode));
  }


  //Join a client to an existing game
  const handleJoinGame = ({name, roomCode}) => {
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

      //Broadcast the game information to the client who just joined the game, and join them to the roomCode socket channel.
      const gameData = { playerName: name, code: roomCode, gameId: gid };
      socket.emit("gameData", gameData);
      socket.join(roomCode);

      //Notify the game object that a new player has joined.
      // Test: enter wrong room code; got error. (add checks)
      games[roomCode].newPlayer(name)

      if(games[roomCode].players.length >= games[roomCode].minPlayers){
        games[roomCode].startGame();
        console.log("sent start game event from join room fn.")
        // socket.emit("start-game", {});
      }

      //Send all players updated user list.
      io.to(roomCode).emit("userData", getUsersInRoom(roomCode));
    }
    console.log("all games --> ", games);
  };

 
  //Perform client disconnection actions
  const handleDisconnect = () => {
    //Remove the user from room tracking.
    const userName = leaveRoom(socket.id);

    //Verify the user was in a room, then perform the other actions upon disconnect
    if (userName) {
      //Send chat message to all users in the room to notify of the disconnection.
      io.to(userName.roomCode).emit("message", {
        sender: "",
        text: `"${userName.name}" left the game.`,
      });
      //Send all players updated user list.
      io.to(userName.roomCode).emit("userData", getUsersInRoom(userName.roomCode));
      //Notify game object that the player has left.
      games[userName.roomCode].disconnection(userName.name)
    }
    //TODO: If going with game API, make this delete empty game.
  }  


  //Forward chat messages to all clients in a room.
  const handleMessageSend = (message) => {
    //Get the room information for the client.
    const senderId = getUser(socket.id);
    //Forward the message to the game object, so it can use it.
    games[senderId.roomCode].chatMessage({sender:message.sender,text:message.text});
    //Use the clients room code to re-transmit the message.
    io.to(senderId.roomCode).emit("message", {
      sender: message.sender,
      text: message.text,
    });
  }
});

//set listen port, and log it.
http.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

//Default routing path.
app.use(express.static(path.resolve(__dirname, "../client/build")));