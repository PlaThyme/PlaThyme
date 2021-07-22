const Game = require("./Game");

class EnigmaBreaker extends Game {
  constructor(roomCode, socket, io, players) {
    super(roomCode, socket, io, players);
    this.teams = {};
    this.redHints = {};
    this.blueHints = {};
  }

  recieveData(data){
    if(data.event === "join-team"){
      if(data.team === "red"){
        this.redTeam.push(data.playerName);
      }
      if(data.team === "blue"){
        this.blueTeam.push(data.playerName);
      }
      if(data.team === "any"){
        if(this.redTeam.length > this.blueTeam.length){
          this.teams[playerName] = "blue";
        } else {
          this.teams[playerName] = "red";
        }
      }
      super.sendGameData({event:"team-info", team:this.teams[playerName]});
    }
    if(data.event === "submit-hint"){

    }
  }

}
module.exports = EnigmaBreaker;