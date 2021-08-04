const Game = require("../Game.js");
const shuffleArray = require("./utils/shuffleArray");
const PACK_OF_CARDS = require("./utils/packOfCards");
const {
  joinRoom,
  leaveRoom,
  getGameId,
  numUsersInRoom,
  getUserByNameAndCode,
} = require("../../rooms.js");
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

    this.playerTurnIndex = 0;
    this.turnStarted = false;
    this.gameStarted = false;
    this.handleEndOfTurn();
    this.gameOver = true;
    this.winner = '';
    this.turn = 'Player 1';
    this.player1Deck = [];
    this.player2Deck = [];
    this.currentColor = '';
    this.currentNumber = '';
    this.playedCardsPile = [];
    this.drawCardPile = [];
    this.roomFull = false;
    this.shuffledCards = [];
    this.startingCardIndex = '';

    //       //shuffle PACK_OF_CARDS array
    // this.shuffledCards = shuffleArray(PACK_OF_CARDS)

    // //extract first 7 elements to player1Deck
    // this.player1Deck = this.shuffledCards.splice(0, 7)

    // //extract first 7 elements to player2Deck
    // this.player2Deck = this.shuffledCards.splice(0, 7)

    // //extract random card from this.shuffledCards and check if its not an action card
    // this.startingCardIndex = '';
    // while(true) {
    //     this.startingCardIndex = Math.floor(Math.random() * 94)
    //     if(this.shuffledCards[this.startingCardIndex]==='skipR' || 
    //     this.shuffledCards[this.startingCardIndex]==='_R' || 
    //     this.shuffledCards[this.startingCardIndex]==='D2R' ||
    //     this.shuffledCards[this.startingCardIndex]==='skipG' || 
    //     this.shuffledCards[this.startingCardIndex]==='_G' || 
    //     this.shuffledCards[this.startingCardIndex]==='D2G' ||
    //     this.shuffledCards[this.startingCardIndex]==='skipB' || 
    //     this.shuffledCards[this.startingCardIndex]==='_B' || 
    //     this.shuffledCards[this.startingCardIndex]==='D2B' ||
    //     this.shuffledCards[this.startingCardIndex]==='skipY' || 
    //     this.shuffledCards[this.startingCardIndex]==='_Y' || 
    //     this.shuffledCards[this.startingCardIndex]==='D2Y' ||
    //     this.shuffledCards[this.startingCardIndex]==='W' || 
    //     this.shuffledCards[this.startingCardIndex]==='D4W') {
    //         continue;
    //     }
    //     else
    //         break;
    // }

    // //extract the card from that this.startingCardIndex into the playedCardsPile
    // this.playedCardsPile = this.shuffledCards.splice(this.startingCardIndex, 1)

    // //store all remaining cards into drawCardPile
    // this.drawCardPile = this.shuffledCards;
    // this.currentColor = this.playedCardsPile[0].charAt(1);
    // this.currentNumber = this.playedCardsPile[0].charAt(0);
  }

   recieveData(data) {
     if (data.event === "updateGameState") {
        this.gameStarted = data.gameOver;
        this.winner = data.winner;
        this.turn = data.turn;
        this.playedCardsPile = data.playedCardsPile;
        this.player1Deck = data.player1Deck;
        this.currentColor = data.currentColor;
        this.currentNumber = data.currentNumber;
        this.drawCardPile = data.drawCardPile;

        super.sendGameData({
          event: "updateGameState",
          data: {
            gameOver: this.gameOver,
            winner: this.winner,
            turn: this.turn,
            player1Deck: this.player1Deck,
            player2Deck: this.player2Deck,
            currentColor: this.currentColor,
            currentNumber: this.currentNumber,
            playedCardsPile: this.playedCardsPile,
            drawCardPile: this.drawCardPile,
          }
        })
  }
}


  startGame() {
  this.gameStarted = true;
  // let player1 = getUserByNameAndCode(this.turnOrder[0], this.roomCode).id;
  // let player2 = getUserByNameAndCode(this.turnOrder[1], this.roomCode).id;
  // this.io.to(player1).emit("playerDetails", {player: 'Player 1'});
  // this.io.to(player2).emit("playerDetails", {player: 'Player 2'});

  super.sendDataToPlayer(this.turnOrder[0],{event: "playerDetails", player: 'Player 1'} );
   super.sendDataToPlayer(this.turnOrder[1],{event: "playerDetails", player: 'Player 2'} );

super.sendGameData({ 
    event: "init-data", 
    data: 
    {
      gameStarted: true, 
      roomFull: true,
      roomCode: this.roomCode,
      users: this.turnOrder,
      gameOver: false,
      turn: 'Player 1',
      player1Deck: [...this.player1Deck],
      player2Deck: [...this.player2Deck],
      currentColor: this.playedCardsPile[0].charAt(1),
      currentNumber: this.playedCardsPile[0].charAt(0),
      playedCardsPile: [...this.playedCardsPile],
      drawCardPile: [...this.drawCardPile]
    } 
  });

      this.gameStarted = true;
    this.roomFull = true;
    super.sendGameData({ event: "start-game" });
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