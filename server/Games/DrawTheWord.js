const Game = require("./Game");

class DrawTheWord extends Game{
    constructor(roomCode, socket, io, players){
        super(roomCode, socket, io, players);
        this.turnOrder = players;
        this.selectedWord = "";
        this.turnStarted = false;
        this.scores = {};
        this.handleEndOfTurn();
    };

    recieveData(data){
        if(data.event === "canvas-data"){
            super.sendGameData(data);
        }
        if(data.event === "clear-canvas-data"){
            super.sendGameData(data);
        }
        if(data.event === "end-turn"){
            super.sendGameData({event:"turn-ended"});
            this.handleEndOfTurn();
        }
        if(data.event === "word-selection"){
            this.selectedWord = data.word;
            super.sendGameData({event:"begin-round"});
            this.turnStarted = true;
        }
        if(data.event === "time-out"){
            this.turnStarted = false;
            super.sendGameData({event:"turn-ended"});
            this.advanceTurnOrder();
        }
    }
    newPlayer(playerName){
        if(playerName){
            this.turnOrder.push(playerName);
            this.scores[playerName] = 0;
        }
    }
    disconnection(playerName){
        console.log("Game Disconnection");
        console.log(this.turnOrder);
        if(playerName === this.turnOrder[0]){
            //Do something about current player disconnection.
            this.turnStarted = false;
            if(this.turnOrder.length === 1){
                this.turnOrder = this.turnOrder.filter((player) => player !== playerName);
                return;
            }
            super.sendGameData({event:"turn-ended"});
            this.advanceTurnOrder();
        }

        //Remove from turnorder, reset score.
        this.turnOrder = this.turnOrder.filter((player) => player !== playerName);
        this.scores[playerName] = 0;

        //Start a new turn
        super.sendGameData({event:"new-turn"});
        
        //Send a request for the current player to select their word.
        let words = this.generateWords();
        const theirTurn = {event:"your-turn", words};
        super.sendDataToPlayer(this.turnOrder[0], theirTurn);
    }
    advanceTurnOrder(){
        const lastPlayer = this.turnOrder.shift();
        this.turnOrder.push(lastPlayer);
    }
    handleEndOfTurn(){
            this.turnStarted = false;
            this.advanceTurnOrder();
            super.sendGameData({event:"new-turn"});
            let words = this.generateWords(); //three words plz.
            const theirTurn = {event:"your-turn", words};
            super.sendDataToPlayer(this.turnOrder[0], theirTurn);
    }
    chatMessage(messageData){
        if(this.turnStarted){
            //Put in message recognition logic here / points recognition.
            //Eg if correct broadcast to start then set turnStarted to false.
            //at the end if correct run this.handleEndOfTurn();
        }
    }
    generateWords(){
        //Place wword creation stuff here.
        return ["camping", "knight", "skyline"];
    }

}

module.exports = DrawTheWord;