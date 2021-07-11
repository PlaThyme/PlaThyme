const Game = require("./Game");
class TestGame extends Game{
    constructor(roomCode, socket, io, players){
        super(roomCode, socket, io, players);
    }


    startGame(){return null;}
                               // Will be run after a new game is created.
    newPlayer(playerName){return null;}                 // When a new player joins room, this method will be called. The string name of the new player will be passed into the funciton. Player will be added to list already.
    disconnection(playerName){return null;}             // This will be called when a player disconnects. String containing players name will be passed in.
    
    recieveData(data){
        super.sendGameData(data);
    }                   // When data is recieved from a client in a room, this method is called with the data sent by the client.
    
    chatMessage(sender, message){return null;}        // When a player sends a chat message this will be called. The sender will be the player name, and the message, both as strings.
}

module.exports = TestGame;