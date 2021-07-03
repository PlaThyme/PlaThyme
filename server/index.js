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
    let info = JSON.parse(data);
    roomName = makeid(6);  
    const gameData = {playerList:[info.playerName], code:roomName, gameId: info.gameId};
    gameRooms[roomName] = gameData;
    socket.emit('gameData', gameData);
    socket.join(roomName);
    socket.number = 1;
  }

});

http.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

app.use(express.static(path.resolve(__dirname, "../client/build")));