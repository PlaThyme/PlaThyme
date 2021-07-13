const {getUser} = require("../rooms.js");

//Generic interface for games.
class Game{
    constructor (roomCode, socket, io, players) {
        this.roomCode = roomCode;  // String, room code is kept here.
        this.players = [players]; //Array of players in this game.
        this.socket = socket;
        this.io = io;
    }

    //Call this function in your class via "super.sendGameData(data) to broadcast a game state update to all players"
    sendGameData(data){
        this.io.to(this.roomCode).emit('update-game',data);
    }
    //Call this function in your class via "super.sendDataToPlayer(playerName, data) to broadcast a game state update to a specific player.
    sendDataToPlayer(playerName, data){
        socket.broadcast.to(getUserByNameAndCode(playerName, this.roomCode).id).emit('update-game-player', data);
    } 


    
    //Impliment the following methods in subclass version of your game, if you want to use their functonality.
    
    startGame(){}                           // Will be run after a new game is created.
    newPlayer(playerName){}               // When a new player joins room, this method will be called. The string name of the new player will be passed into the funciton. Player will be added to list already.
    disconnection(playerName){}             // This will be called when a player disconnects. String containing players name will be passed in.
    recieveData(data){}                   // When data is recieved from a client in a room, this method is called with the data sent by the client.
    chatMessage({sender, message}){}       // When a player sends a chat message this will be called. The sender will be the player name, and the message, both as strings.
    
}

module.exports = Game;