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
    this.redSel = ["0", "0", "0"];
    this.blueSel = ["0", "0", "0"];
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
        });
      }
      if (this.teams[data.playerName] === "blue") {
        super.sendDataToPlayer(data.playerName, {
          event: "team-info",
          team: "blue",
          selections: this.blueSel,
        });
      }
    }

    if (data.event === "team-chat") {
      this.handleTeamChat(data);
    }

    if (data.event === "submit-hint") {
    }
    if (data.event === "red-selections") {
      this.handleRedSelections(data);
    }
    if (data.event === "blue-selections") {
      this.handleBlueSelections(data);
    }
  }
  handleTeamChat(data){
    if(data.team === "red"){
      for (let i = 0; i < this.redTurnOrder.length; i++) {
        super.sendDataToPlayer(this.redTurnOrder[i], {
          event: "team-chat",
          message: data.message
        });
      }
    }
    if(data.team === "blue"){
      for (let i = 0; i < this.blueTurnOrder.length; i++) {
        super.sendDataToPlayer(this.blueTurnOrder[i], {
          event: "team-chat",
          message: data.message
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
    for (let i = 1; i < this.redTurnOrder.length; i++) {
      super.sendDataToPlayer(this.redTurnOrder[i], {
        event: "selections",
        selections: this.redSel,
      });
    }
  }
  handleBlueSelections(data) {
    this.blueSel.splice(data.index, 1, data.num);
    for (let i = 1; i < this.blueTurnOrder.length; i++) {
      super.sendDataToPlayer(this.blueTurnOrder[i], {
        event: "selections",
        selections: this.blueSel,
      });
    }
  }
  handleEndOfTurn() {}
}
module.exports = EnigmaBreaker;
