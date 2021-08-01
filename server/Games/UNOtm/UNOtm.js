const Game = require("../Game");

class UNOtm extends Game {
  /** 
   * All the game variables required by `DrawTheWord` are initialized here. 
  **/
  constructor(roomCode, socket, io, players, minPlayers) {
    super(roomCode, socket, io, players, minPlayers);
    this.minPlayers = minPlayers;
    this.turnOrder = [players];
    this.turnStarted = false;
    this.gameStarted = false;
    this.handleEndOfTurn();
    this.gameOver = true;
    this.winner = '';
    this.turn = '';
    this.player1Deck = [];
    this.player2Deck = [];
    this.currentColor = '';
    this.currentNumber = '';
    this.playedCardsPile = [];
    this.drawCardPile = [];
    this.roomFull = false;
  }

   recieveData(data) {}

   /**
   * when minimum number of players join the GameRoom, start the game.
   */
  startGame() {
    super.sendGameData({ event: "start-game" });
    this.gameStarted = true;
    this.roomFull = true;
  }

  newPlayer(playerName) {
    super.newPlayer(playerName);
    if (playerName) {
      this.turnOrder.push(playerName);
    }
  }

  disconnection(playerName) {}

  handleEndOfTurn() {}

}

module.exports = UNOtm;