const Game = require("./Game");

class DrawTheWord extends Game{
    constructor(roomCode, socket, io, players){
        super(roomCode, socket, io, players);
        this.turnOrder = [];
        this.selectedWord = "";
        this.turnStarted = false;
        this.scores = {};
    };

    recieveData(data){
        if(data.event === "canvas-data"){
            super.sendGameData(data);
        }
        if(data.event === "clear-canvas-data"){
            super.sendGameData(data);
        }
        if(data.event === "end-turn"){
            this.turnStarted = false;
            this.advanceTurnOrder();
            let data = {event:"new-turn"}
            super.sendGameData(data);
            //Put in word selection code here !!!!!!!!!!!!!!!!!!!!!!!
            let words = []; //three words plz.
            const theirTurn = {event:"your-turn", words};
            super.sendDataToPlayer(this.turnOrder[0], theirTurn);
        }
        if(data.event === "word-selection"){
            this.selectedWord = data.word;
            super.sendGameData({event:"begin-round"});
            this.turnStarted = true;
        }
    }
    newPlayer(playerName){
        if(playerName){
            turnOrder.push(playerName);
            this.scores[playerName] = 0;
        }
    }
    disconnection(playerName){
        if(playerName === this.turnOrder[0]){
            //Do something about current player disconnection.
        }

        //Remove from turnorder, reset score.
        this.turnOrder = this.turnOrder.filter((player) => player !== playerName);
        this.scores[playerName] = 0;
    }
    advanceTurnOrder(){
        const lastPlayer = this.turnOrder.shift();
        this.turnOrder.push(lastPlayer);
    }
    chatMessage(messageData){
        if(this.turnStarted){
            //Put in message recognition logic here / points recognition.
            //Eg if correct broadcast to start then set turnStarted to false.
        }
    }

}

module.exports = DrawTheWord;