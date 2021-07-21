const Game = require("./Game");
class EnigmaBreaker extends Game {
  constructor(roomCode, socket, io, players) {
    super(roomCode, socket, io, players);
  }
  //add my game methods here
}
module.exports = EnigmaBreaker;