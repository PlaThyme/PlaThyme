const Game = require("./Game");
class TestGame extends Game{
    constructor(roomCode, socket, io, players){
        super(roomCode, socket, io, players);
    }


    recieveData(data){
        if(data.event === "bg-colour-change"){
            super.sendGameData(data);
        }
    }
}

module.exports = TestGame;