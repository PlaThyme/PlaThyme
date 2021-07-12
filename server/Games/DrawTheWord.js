const Game = require("./Game");
class DrawTheWord extends Game{
    constructor(roomCode, socket, io, players){
        super(roomCode, socket, io, players);
    }

    recieveData(data){
        if(data.event === "canvas-data"){
            super.sendGameData(data);
        }
        if(data.event === "clear-canvas-data"){
            super.sendGameData(data);
        }
    }
}

module.exports = DrawTheWord;