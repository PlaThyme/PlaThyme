const path = require("path");
const express = require("express");
const PORT = process.env.PORT || 3001;
const app = express();
const http = require('http').createServer(app)
const {makeid} = require('./makeid');

const {joinRoom, leaveRoom, getUser, getGameId, numUsersInRoom, getUsersInRoom} = require("./rooms.js");

//Get sockets running
const io = require('socket.io')(http);

//Upon connection, log the fact, emit nothing.
io.on('connection', socket => {
  console.log('Client Connected');

  socket.emit('message', "yup");

  socket.on('newRoom', (data) => {console.log(data);handleCreateGame(data)});

  socket.on('leaveRoom', () => leaveRoom(socket.id));

  socket.on('messageSend', (message) => {handleMessageSend(message)});

  socket.on('joinGame', ({name, roomCode}, callback) =>{
    console.log(name,roomCode)
    const gid = getGameId(roomCode);
    if(gid === null){
    //  callback('No Such Room');
    }
    const error = joinRoom({id:socket.id, gameId:gid, playerName:name, roomCode:roomCode})
    //if(error){return callback(error)}

    socket.broadcast.to(roomCode).emit('message', {sender:'PlaThyme', text:`${name} has joined the game.`});
    io.to(roomCode).emit('userData', getUsersInRoom(roomCode));

    const gameData = {playerName: name, code:roomCode, gameId: gid};
    socket.emit('gameData', gameData);
    socket.join(roomCode);
    
  });



  function handleCreateGame(data){
    console.log(data);
    roomCode = makeid(6);

    //Check if the random ID was a repeat. If so, recursively attempt again.
    if(numUsersInRoom(roomCode) > 0){
      handleCreateGame(data);
      return;
    }


    const gameData = {playerName: data.name, code:roomCode, gameId: data.gameId};
    
    //Adds user to room tracking.
    let error = joinRoom({id: socket.id, name:data.name, gameId: data.gameId, roomCode:roomCode});
    //if(error){return callback(error)}

    socket.emit('gameData', gameData);
    socket.join(roomCode);
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
    io.to(gameRoom)
  }

  function handleLeaveGame (id) {
    leaveRoom(id);
  }

  function handleMessageSend(message){
    const sender = getUser(socket.id);
    io.to(sender.roomCode).emit('message',{sender: sender.name, text: message})
  }
});

http.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

app.use(express.static(path.resolve(__dirname, "../client/build")));