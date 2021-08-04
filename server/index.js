const express = require("express");
const path = require("path");
const cors = require("cors");
const PORT = process.env.PORT || 3001;
const app = express();
const http = require("http").createServer(app);
const TestGame = require("./Games/TestGame");
const DrawTheWord = require("./Games/DrawTheWord");
const UNOtm = require("./Games/UNOtm/UNOtm");
const { makeid } = require("./makeid");
const {
  joinRoom,
  leaveRoom,
  getUser,
  getGameId,
  numUsersInRoom,
  getUsersInRoom,
  getUserByNameAndCode,
} = require("./rooms.js");
// const { default: UNOTM } = require("../client/src/Games/UNOtm/UNOtm");

//games is a dict of the game state objects, indexed bt the roomCode.
const games = {};

//Get sockets running
const io = require("socket.io")(http, {cors:{origin:'*'}});
app.use(cors());

//Handle all events related to a socket connection.
io.on("connection", (socket) => {
  console.log("Client Connected");

  //Socket events to handle the various events.
  socket.on("newRoom", (data) => handleCreateGame(data));
  socket.on("leaveRoom", () => {try{leaveRoom(socket.id)} catch (error){console.error(error);}});
  socket.on("messageSend", (message) => handleMessageSend(message));
  socket.on("leaveGame", () => handleDisconnect());
  socket.on("disconnect", () => handleDisconnect());
  socket.on("joinGame", ({ name, roomCode }) => handleJoinGame({ name, roomCode }));
  socket.on("game-data", (data) => {
    try{

      if (getUser(socket.id)) {
        games[getUser(socket.id).roomCode].recieveData(data);
      }
    } catch (error) {
      console.error(error);
    }
  });
  // socket.on("updateGameState", (data) => {
  //   try{
  //     if (getUser(socket.id)) {
  //       games[getUser(socket.id).roomCode].recieveData(data);
  //     }
  //   } catch (error) {
  //     console.error(error);
  //   }
  // })
socket.on('initGameState', gameState => {
   const user = getUser(socket.id)
   console.log("user == ", user);
        io.to(user.roomCode).emit('initGameState', gameState);
    })
     socket.on('updateGameState', gameState => {
        const user = getUser(socket.id)
        
        if(user)
            io.to(user.roomCode).emit('updateGameState', gameState)
    })
        socket.on('sendMessage', (payload, callback) => {
        const user = getUser(socket.id)
        io.to(user.roomCode).emit('message', {user: user.name, text: payload.message})
        callback()
    })
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
      roomCode: roomCode,
      score: 0,
    });

    //Transmit the game info to the client, and join them to the socket channel for the roomCode.
    socket.emit("gameData", gameData);
    socket.join(roomCode);

    //When Making a game, the game must be added to the list below for its creation with its matching ID.
    //Create a new game object for the selected game, and call its start game function.
    switch (data.gameId) {
      case 1:
        games[roomCode] = new DrawTheWord(roomCode, socket, io, data.name, data.minPlayers );
        /**
         * Notify the new game object that its been started.
         * "DrawTheWord" game has a "waitingRoom". (the game will not start till all the minimum players join the `GameRoom`),
         * events related to that are implemented within startGame() within game logic file (DrawTheWord.js).
         * */
        if (games[roomCode].players.length === games[roomCode].minPlayers) {
          games[roomCode].startGame();
          socket.emit("start-game", {}); // informs App.js to render game component.
        }
        break;
      case 2:
        games[roomCode] = new TestGame(roomCode, socket, io, data.name);
        break;
      case 4:
        console.log("UNO game selected\n");
        games[roomCode] = new UNOtm(roomCode, socket, io, data.name, data.minPlayers);
        if (games[roomCode].players.length === games[roomCode].minPlayers) {
          games[roomCode].startGame();
          socket.emit("start-game", {}); // informs App.js to render game component.
        }
        break;
      default:
        break;
    }

    if (data.gameId === 2) {
      games[roomCode] = new TestGame(roomCode, socket, io, data.name);
    }

    //Send all players updated user list.
    io.to(roomCode).emit("userData", getUsersInRoom(roomCode));
  };

  //Join a client to an existing game
  const handleJoinGame = ({ name, roomCode }) => {
    try {
      const gid = getGameId(roomCode);

      //Make sure game room exists.
      if (gid === null) {
        socket.emit("error", { error: "gid" });
        return;
      }

      //Try to join the user to the room.
      let error = joinRoom({
        id: socket.id,
        gameId: gid,
        name: name,
        roomCode: roomCode,
        score: 0,
      });

      //Check for duplicate user.
      if (error.error === "dup") {
        socket.emit("error", { error: "dup" });
        return;
      }

      //If the user name is valid, join the player to the room, aand
      if (error.error !== "dup" && error.error !== "dup") {
        socket.broadcast.to(roomCode).emit("message", {
          sender: "",
          text: `"${name}" has joined the game.`,
        });

        //Broadcast the game information to the client who just joined the game, and join them to the roomCode socket channel.
        const gameData = { playerName: name, code: roomCode, gameId: gid };
        const userId = socket.id;
        games[roomCode].newPlayer(name);

        socket.emit("gameData", gameData);
        socket.join(roomCode);

        //Notify the game object that a new player has joined.
        // Test: enter wrong room code; got error. (add checks)
        

        if ( games[roomCode].players.length >= games[roomCode].minPlayers && gid === 1) {
          games[roomCode].startGame();
        }
        if ( games[roomCode].players.length >= games[roomCode].minPlayers &&  gid === 4) {
          console.log("inside game 4 join statement");
          
          if(games[roomCode].players.length === games[roomCode].minPlayers){
            console.log("roomData... and currentUserData...");
            // io.to(roomCode).emit('start-game');
            // games[roomCode].startGame();
            io.to(roomCode).emit('roomData', {users: games[roomCode].players, roomCode: roomCode});
            io.to(getUserByNameAndCode(games[roomCode].players[0], roomCode).id).emit('currentUserData', {name: 'Player 1'});
            io.to(getUserByNameAndCode(games[roomCode].players[1], roomCode).id).emit('currentUserData', {name: 'Player 2'});
          } 
          if(games[roomCode].players.length > games[roomCode]){
            // send an error event indicating thta current room i sfull and redireect them to home page agin.
            console.log("*Room full*");
          }
        }
        //Send all players updated user list.
        io.to(roomCode).emit("userData", getUsersInRoom(roomCode));
      }
    } catch (error) {
      console.error(error);
    }
  };

  //Perform client disconnection actions
  const handleDisconnect = () => {
    try {
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
        io.to(userName.roomCode).emit(
          "userData",
          getUsersInRoom(userName.roomCode)
        );
        //Notify game object that the player has left, if the game exists.
        if (games[userName.roomCode]) {
          games[userName.roomCode].disconnection(userName.name);
          if (numUsersInRoom(userName.roomCode === 0)) {
            delete games[userName.roomCode];
          }
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  //Forward chat messages to all clients in a room.
  const handleMessageSend = (message) => {
    try {
      //Get the room information for the client.
      const senderId = getUser(socket.id);
      //Forward the message to the game object, so it can use it.
      //Use the clients room code to re-transmit the message.
      io.to(senderId.roomCode).emit("message", {
        sender: message.sender,
        text: message.text,
      });
      games[senderId.roomCode].chatMessage({
        sender: message.sender,
        text: message.text,
      });
    } catch (error) {
      console.error(error);
    }
  };
});

//set listen port, and log it.
http.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

//Default routing path.
app.use(express.static(path.resolve(__dirname, "../client/build")));