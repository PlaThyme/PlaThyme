const Game = require("./Game");

class EnigmaBreaker extends Game {
  constructor(roomCode, socket, io, players) {
    super(roomCode, socket, io, players);
    this.teams = {};
    this.redHints = {};
    this.blueHints = {};
    this.redNum = 0;
    this.blueNum = 0;
  }

  recieveData(data){
    if(data.event === "join-team"){
      if(data.team === "red"){
        this.teams[data.playerName] = "red"
        this.redNum += 1;
      }
      if(data.team === "blue"){
        this.teams[data.playerName] = "blue"
        this.blueNum += 1;
      }
      if(data.team === "any"){
        if(this.redNum > this.blueNum){
          this.teams[data.playerName] = "blue";
        } else {
          this.teams[data.playerName] = "red";
        }
      }
      super.sendGameData({event:"team-info", team:this.teams[data.playerName]});
    }
    if(data.event === "submit-hint"){

    }
  }

}
module.exports = EnigmaBreaker;