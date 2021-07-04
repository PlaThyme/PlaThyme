const path = require("path");
const express = require("express");
const PORT = process.env.PORT || 3001;
const app = express();
const http = require('http').createServer(app)
const {makeid} = require('./makeid');
const gameStates = {};
const gameRooms = {};


//Get sockets running
const io = require('socket.io')(http);

//Upon connection, log the fact, emit nothing.
io.on('connection', socket => {
  console.log('Client Connected');

  socket.on('newRoom', (data) => {handleCreateGame(data)})

  function handleCreateGame(data){
    roomName = makeid(6);  
    const gameData = {playerList: data.name, code:roomName, gameId: data.gameId};
    gameRooms[roomName] = gameData;
    socket.emit('gameData', gameData);
    socket.join(roomName);
    console.log(gameData);
  }

  //From https://github.com/HungryTurtleCode/multiplayerSnake/blob/master/server/server.js
  function handleJoinGame (data) {
    const gameRoom = io.sockets.adapter.rooms[gameCode];
    let allUsers;
    if(gameRoom){
      allUsers = room.sockets;
    }

    let numUsers = 0;
    if (allUsers) {
      numUsers = Object.keys(allUsers).length;
    }

  }

});

http.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

app.use(express.static(path.resolve(__dirname, "../client/build")));