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

    // this.playerTurnIndex = 0;
    // this.turnStarted = false;
    // this.gameStarted = false;
    // this.handleEndOfTurn();
    // this.gameOver = true;
    // this.winner = '';
    // this.turn = 'Player 1';
    // this.player1Deck = [];
    // this.player2Deck = [];
    // this.currentColor = '';
    // this.currentNumber = '';
    // this.playedCardsPile = [];
    // this.drawCardPile = [];
    // this.roomFull = false;
    // this.shuffledCards = [];
    // this.startingCardIndex = '';
  }

   recieveData(data) {
  //    if (data.event === "updateGameState") {
  //       super.sendGameData({
  //         event: "updateGameState",
  //         data: {
  //           gameOver: this.gameOver,
  //           winner: this.winner,
  //           turn: this.turn,
  //           player1Deck: this.player1Deck,
  //           player2Deck: this.player2Deck,
  //           currentColor: this.currentColor,
  //           currentNumber: this.currentNumber,
  //           playedCardsPile: this.playedCardsPile,
  //           drawCardPile: this.drawCardPile,
  //         }
  //       })
  // }
     if (data.event === "initGameState") {
      super.sendGameData(data);
    }
     if (data.event === "updateGameState") {
      super.sendGameData(data);
    }
}

  startGame() {
super.sendGameData({event: "roomData", users: this.players, roomCode: this.roomCode});
//  io.to(roomCode).emit('roomData', {users: games[roomCode].players, roomCode: roomCode});
super.sendDataToPlayer(this.turnOrder[0], { event: "currentUserData", name: 'Player 1' });
super.sendDataToPlayer(this.turnOrder[1], { event: "currentUserData", name: 'Player 2' });

// io.to(getUserByNameAndCode(games[roomCode].players[0], roomCode).id).emit('currentUserData', {name: 'Player 1'});
// io.to(getUserByNameAndCode(games[roomCode].players[1], roomCode).id).emit('currentUserData', {name: 'Player 2'});


    
  // this.gameStarted = true;
  // let player1 = getUserByNameAndCode(this.turnOrder[0], this.roomCode).id;
  // let player2 = getUserByNameAndCode(this.turnOrder[1], this.roomCode).id;
  // this.io.to(player1).emit("playerDetails", {player: 'Player 1'});
  // this.io.to(player2).emit("playerDetails", {player: 'Player 2'});

//   super.sendDataToPlayer(this.turnOrder[0],{event: "playerDetails", player: 'Player 1'} );
//    super.sendDataToPlayer(this.turnOrder[1],{event: "playerDetails", player: 'Player 2'} );

// super.sendGameData({ 
//     event: "init-data", 
//     data: 
//     {
//       gameStarted: true, 
//       roomFull: true,
//       roomCode: this.roomCode,
//       users: this.turnOrder,
//       gameOver: false,
//       turn: 'Player 1',
//       player1Deck: [...this.player1Deck],
//       player2Deck: [...this.player2Deck],
//       currentColor: this.playedCardsPile[0].charAt(1),
//       currentNumber: this.playedCardsPile[0].charAt(0),
//       playedCardsPile: [...this.playedCardsPile],
//       drawCardPile: [...this.drawCardPile]
//     } 
//   });

//       this.gameStarted = true;
//     this.roomFull = true;
//     super.sendGameData({ event: "start-game" });
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