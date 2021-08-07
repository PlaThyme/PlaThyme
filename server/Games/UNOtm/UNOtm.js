const Game = require("../Game.js");
class UNOtm extends Game {
  /** 
   * All the game variables required by `DrawTheWord` are initialized here. 
  **/
  constructor(roomCode, socket, io, players, minPlayers) {
    super(roomCode, socket, io, players, minPlayers);
    this.roomCode = roomCode;
    this.socket = socket;
    this.io = io;
    this.minPlayers = minPlayers;
    this.turnOrder = [players];
  }

   recieveData(data) {
     if (data.event === "initGameState") {
      super.sendGameData(data);
    }
     if (data.event === "updateGameState") {
      super.sendGameData(data);
    }
    if(data.event === "playerLeft"){
      super.sendGameData(data);
    }
}

  startGame() {
super.sendGameData({event: "roomData", users: this.players, roomCode: this.roomCode});
super.sendDataToPlayer(this.turnOrder[0], { event: "currentUserData", name: 'Player 1' });
super.sendDataToPlayer(this.turnOrder[1], { event: "currentUserData", name: 'Player 2' });
  }

  newPlayer(playerName) {
 super.newPlayer(playerName);
    if (playerName) {
      this.turnOrder.push(playerName);
    }
  }

  disconnection(playerName) {}

  handleEndOfTurn() {}
    chatMessage(messageData) {}

}

module.exports = UNOtm;