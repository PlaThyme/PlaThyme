const Game = require("../Game");
const wordsList = require("./wordsList");

class EnigmaBreaker extends Game {
  constructor(roomCode, socket, io, players) {
    super(roomCode, socket, io, players);
    this.teams = {};
    this.redTurnOrder = [];
    this.blueTurnOrder = [];
    this.redHints = [];
    this.blueHints = [];
    this.redNum = 0;
    this.blueNum = 0;
    this.currentRound = 0;
    this.redSel = ["0", "0", "0", "0", "0", "0"];
    this.blueSel = ["0", "0", "0", "0", "0", "0"];
    this.statusMessage = "Waiting for more players...";
    this.started = false;
    this.words = wordsList;
    this.redWords = this.generateWords();
    this.blueWords = this.generateWords();
    this.redCode = ["E", "R", "R"];
    this.blueCode = ["E", "R", "R"];
    this.redGuessHistory = [];
    this.blueGuessHistory = [];
    this.redScore = [0, 0];
    this.blueScore = [0, 0];
  }

  recieveData(data) {
    switch (data.event) {
      case "join-team":
        this.handleJoinTeam(data);
        break;
      case "team-chat":
        this.handleTeamChat(data);
        break;
      case "red-selections":
        this.handleRedSelections(data);
        break;
      case "blue-selections":
        this.handleBlueSelections(data);
        break;
      case "begin-game":
        this.handleStartGame();
        this.handleStartTurn();
        break;
      case "red-hints":
        this.handleRedHints(data);
        break;
      case "blue-hints":
        this.handleBlueHints(data);
        break;
      case "submit-guess":
        this.handleGuess(data);
        break;
      case "next-round":
        this.advanceTurnOrder();
        this.handleStartTurn();
      default:
        break;
    }
  }
  handleTeamChat(data) {
    if (data.team === "red") {
      for (let i = 0; i < this.redTurnOrder.length; i++) {
        super.sendDataToPlayer(this.redTurnOrder[i], {
          event: "team-chat",
          message: data.message,
        });
      }
    }
    if (data.team === "blue") {
      for (let i = 0; i < this.blueTurnOrder.length; i++) {
        super.sendDataToPlayer(this.blueTurnOrder[i], {
          event: "team-chat",
          message: data.message,
        });
      }
    }
  }
  advanceTurnOrder() {
    const lastPlayer = this.redTurnOrder.shift();
    this.redTurnOrder.push(lastPlayer);
    const lastPlayer2 = this.blueTurnOrder.shift();
    this.blueTurnOrder.push(lastPlayer2);
  }
  handleRedSelections(data) {
    this.redSel.splice(data.index, 1, data.num);
    this.redTurnOrder.forEach((player) => {
      super.sendDataToPlayer(player, {
        event: "selections",
        selections: this.redSel,
      });
    });
  }
  handleBlueSelections(data) {
    this.blueSel.splice(data.index, 1, data.num);
    this.redTurnOrder.forEach((player) => {
      super.sendDataToPlayer(player, {
        event: "selections",
        selections: this.blueSel,
      });
    });
  }
  generateWords() {
    let encoded = [];
    let rand = Math.floor(Math.random() * this.words.length);
    encoded.push(this.words.splice(rand, 1));
    rand = Math.floor(Math.random() * this.words.length);
    encoded.push(this.words.splice(rand, 1));
    rand = Math.floor(Math.random() * this.words.length);
    encoded.push(this.words.splice(rand, 1));
    rand = Math.floor(Math.random() * this.words.length);
    encoded.push(this.words.splice(rand, 1));
    return encoded;
  }
  generateCode() {
    const nums = ["1", "2", "3", "4"];
    let code = [];
    let rand = Math.floor(Math.random() * nums.length);
    code.push(nums.splice(rand, 1)[0]);
    rand = Math.floor(Math.random() * nums.length);
    code.push(nums.splice(rand, 1)[0]);
    rand = Math.floor(Math.random() * nums.length);
    code.push(nums.splice(rand, 1)[0]);
    return code;
  }
  handleBeginGame() {
    this.handleStartTurn();
  }
  handleEndOfTurn() {
    this.advanceTurnOrder();
  }
  handleNewGame() {}

  handleRedHints(data) {
    this.redHints.push([data.hint1, data.hint2, data.hint3]);
    super.sendGameData({ event: "red-hints-in" });
    if (this.blueHints.length > this.currentRound) {
      this.handleHintsSubmitted();
    }
  }
  handleBlueHints(data) {
    this.blueHints.push([data.hint1, data.hint2, data.hint3]);
    super.sendGameData({ event: "blue-hints-in" });
    if (this.redHints.length > this.currentRound) {
      this.handleHintsSubmitted();
    }
  }

  handleHintsSubmitted() {
    super.sendGameData({
      event: "decryption",
      redHints: this.redHints[this.currentRound],
      blueHints: this.blueHints[this.currentRound],
    });
  }

  handleStartGame() {
    super.sendGameData({ event: "start-game" });
  }
  handleStartTurn() {
    this.redSel = ["0", "0", "0", "0", "0", "0"];
    this.blueSel = ["0", "0", "0", "0", "0", "0"];

    super.sendGameData({event:"new-turn", selections: this.redSel,});

    this.redCode = this.generateCode();
    this.blueCode = this.generateCode();

    super.sendDataToPlayer(this.redTurnOrder[0], {
      event: "your-turn",
      code: this.redCode,
    });
    super.sendDataToPlayer(this.blueTurnOrder[0], {
      event: "your-turn",
      code: this.blueCode,
    });
  }

  handleGuess(data) {
    if (data.team === "red") {
      this.redGuessHistory.push(data.guess);
      if (this.blueGuessHistory.length === this.currentRound) {
        super.sendGameData({ event: "wait-blue-guess" });
      } else {
        this.handleScoreGame();
      }
      this.redTurnOrder.forEach((player) => {
        super.sendDataToPlayer(player,{event:"guess-data",guess:data.guess});
      });
    } else {
      this.blueGuessHistory.push(data.guess);
      if (this.redGuessHistory.length === this.currentRound) {
        super.sendGameData({ event: "wait-red-guess" });
      } else {
        this.handleScoreGame();
      }
      this.blueTurnOrder.forEach((player) => {
        super.sendDataToPlayer(player,{event:"guess-data",guess:data.guess});
      });
    }
  }

  handleScoreGame() {
    let redGuess = this.redGuessHistory[this.currentRound];
    let blueGuess = this.blueGuessHistory[this.currentRound];
    let score = [0, 0, 0, 0];
    let actual = [
      this.redCode[0],
      this.redCode[1],
      this.redCode[2],
      this.blueCode[0],
      this.blueCode[1],
      this.blueCode[2],
    ];
    if (
      redGuess[0] === this.redCode[0] &&
      redGuess[1] === this.redCode[1] &&
      redGuess[2] === this.redCode[2]
    ) {
    } else {
      score[1] = 1;
      this.redScore[1] += 1;
    }
    if (
      redGuess[3] === this.blueCode[0] &&
      redGuess[4] === this.blueCode[1] &&
      redGuess[5] === this.blueCode[2]
    ) {
      score[0] = 1;
      this.redScore[0] += 1;
    }

    if (
      blueGuess[3] === this.blueCode[0] &&
      blueGuess[4] === this.blueCode[1] &&
      blueGuess[5] === this.blueCode[2]
    ) {
    } else {
      score[3] = 1;
      this.blueScore[1] += 1;
    }
    if (
      blueGuess[0] === this.redCode[0] &&
      blueGuess[1] === this.redCode[1] &&
      blueGuess[2] === this.redCode[2]
    ) {
      score[2] = 1;
      this.blueScore[0] += 1;
    }
    super.sendGameData({
      event: "score-result",
      score: score,
      codes: actual,
      redScore: this.redScore,
      blueScore: this.blueScore,
    });
  }

  handleJoinTeam(data) {
    if (data.team === "red") {
      this.teams[data.playerName] = "red";
      this.redNum += 1;
      this.redTurnOrder.push(data.playerName);
    }
    if (data.team === "blue") {
      this.teams[data.playerName] = "blue";
      this.blueNum += 1;
      this.blueTurnOrder.push(data.playerName);
    }
    if (data.team === "any") {
      if (this.redNum > this.blueNum) {
        this.teams[data.playerName] = "blue";
        this.blueNum += 1;
        this.blueTurnOrder.push(data.playerName);
      } else {
        this.teams[data.playerName] = "red";
        this.redNum += 1;
        this.redTurnOrder.push(data.playerName);
      }
    }
    if (this.teams[data.playerName] === "red") {
      super.sendDataToPlayer(data.playerName, {
        event: "team-info",
        team: "red",
        selections: this.redSel,
        status: this.statusMessage,
        wordList: this.redWords,
      });
    }
    if (this.teams[data.playerName] === "blue") {
      super.sendDataToPlayer(data.playerName, {
        event: "team-info",
        team: "blue",
        selections: this.blueSel,
        status: this.statusMessage,
        wordList: this.blueWords,
      });
    }
    if (this.redNum > 1 && this.blueNum > 1 && this.started === false) {
      super.sendGameData({ event: "allow-start" });
    }
  }
}
module.exports = EnigmaBreaker;
