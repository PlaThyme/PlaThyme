const Game = require("./Game");

class EnigmaBreaker extends Game {
  constructor(roomCode, socket, io, players) {
    super(roomCode, socket, io, players);
    this.teams = {};
    this.redTurnOrder = [];
    this.blueTurnOrder = [];
    this.redHints = {};
    this.blueHints = {};
    this.redNum = 0;
    this.blueNum = 0;
  }

  recieveData(data) {
    if (data.event === "join-team") {
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
          this.redNum += 1;
          this.redTurnOrder.push(data.playerName);
        } else {
          this.teams[data.playerName] = "red";
          this.blueNum += 1;
          this.blueTurnOrder.push(data.playerName);
        }
      }
      super.sendGameData({
        event: "team-info",
        team: this.teams[data.playerName],
      });
    }
    if (data.event === "submit-hint") {
    }
    if (data.event === "red-selections") {
      for(let i = 1; i < this.redTurnOrder.length; i++){
        super.sendDataToPlayer(this.redTurnOrder[i], {
          event:"selections",
          selections:data.selections
        });
      }
    }
    if (data.event === "blue-selections") {
      for(let i = 1; i < this.blueTurnOrder.length; i++){
        super.sendDataToPlayer(this.blueTurnOrder[i], {
          event:"selections",
          selections:data.selections
        });
      }
    }
  }
}
module.exports = EnigmaBreaker;
