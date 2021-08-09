/**
 * @Game UNO™
 */

const Game = require("./Game.js");
class UNOtm extends Game {
  /** 
   * All the game variables required by `UNO™` are initialized here. 
  **/
  constructor(roomCode, socket, io, players, minPlayers) {
    super(roomCode, socket, io, players, minPlayers);
    this.roomCode = roomCode;
    this.socket = socket;
    this.io = io;
    this.minPlayers = minPlayers;
    this.turnOrder = [players];
  }

  /**
   * This method si used to receive updtaed Game state.
   * @param {any} data - data received after players made a move. 
   */
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

  /**
   * This method is used to perform action, when minimum number of players joined the game Room.
   */
  startGame() {
    super.sendGameData({event: "roomData", users: this.players, roomCode: this.roomCode});
    super.sendDataToPlayer(this.turnOrder[0], { event: "currentUserData", name: 'Player 1' });
    super.sendDataToPlayer(this.turnOrder[1], { event: "currentUserData", name: 'Player 2' });
  }

  /**
   * This is a handle method used to add player name to the room.
   * @param {String} playerName - new player name, that joined the Game Room 
   */
  newPlayer(playerName) {
    super.newPlayer(playerName);
    if (playerName) {
      this.turnOrder.push(playerName);
    }
  }

  /**
   * Additional functions to use
   */
  disconnection(playerName) {}
  handleEndOfTurn() {}
  chatMessage(messageData) {}

}

module.exports = UNOtm;