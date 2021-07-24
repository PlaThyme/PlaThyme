const assert = require('chai').assert;
const DrawTheWord = require('../Games/DrawTheWord');
const { createServer } = require("http");
const { Server } = require("socket.io");
const Client = require("socket.io-client");
const {
    joinRoom,
    leaveRoom,
    getUser,
    getGameId,
    numUsersInRoom,
    getUsersInRoom,
    getUserByNameAndCode,
    updateScore,
  } = require("../rooms.js");
  
describe("DrawTheWord", () => {

    let io, serverSocket, clientSocket, testGame;

    before((done) => {
      const httpServer = createServer();
      io = new Server(httpServer);
      httpServer.listen(() => {
        const port = httpServer.address().port;
        clientSocket = new Client(`http://localhost:${port}`);
        clientSocket2 = new Client(`http://localhost:${port}`);
        clientSocket3 = new Client(`http://localhost:${port}`);
        io.on("connection", (socket) => {
          serverSocket = socket;
          serverSocket.join("123456");
        });
        testGame = new DrawTheWord("123456", serverSocket, io, "Player1");
        clientSocket.on("connect", ()=>{});
        clientSocket2.on("connect", ()=>{});
        clientSocket3.on("connect", done);
      });
    });
  
    after(() => {
      io.close();
      clientSocket.close();
      clientSocket2.close();
      clientSocket3.close();
    });

    it("Testing adding new players. Adding to turn order", () => {
        let player1 = {id:clientSocket.id, name:"Player1", gameId:"1", roomCode:"123456", score:0};
        let player2 = {id:clientSocket2.id, name:"Player2", gameId:"1", roomCode:"123456", score:0};
        let player3 = {id:clientSocket3.id, name:"Player3", gameId:"1", roomCode:"123456", score:0};
        joinRoom(player1);
        joinRoom(player2);
        joinRoom(player3);
        testGame.newPlayer(player2.name);
        testGame.newPlayer(player3.name);
        assert.equal("Player1",testGame.turnOrder[0]);
    });


    it("Testing end of turn, turn advancing.", (done) => {
        clientSocket2.on("update-game-player", (data) => {
            if(data.event === "your-turn"){
                assert.equal("Player2",testGame.turnOrder[0]);
                assert.isNotNull(data.words);
                done();
            }
        });
        testGame.recieveData({event:"end-turn"})
      });
    


    it("Retransmit canvas update.", (done) => {
      clientSocket.on("update-game", (data) => {
        if(data.event === "canvas-data"){
          assert.equal(data.img, "imgdata");
          done();
        }
      });
      testGame.recieveData({event:"canvas-data", img:"imgdata"});
    });

    it("Retransmit clear canvas.", (done) => {
      clientSocket.on("update-game", (data) => {
        if(data.event === "clear-canvas-data"){
          assert.equal(data.clear, "clear");
          done();
        }
      });
      testGame.recieveData({event:"clear-canvas-data", clear:"clear"});
    });


    it("Handle word selection and begin round", (done) => {
      clientSocket.on("update-game", (data) => {
        if(data.event === "begin-round"){
          assert.equal(40, data.timer);
        }
        if(data.event === "show-blank-word"){
          assert.equal(6, data.wordLength);
          done();
        }
      });
      testGame.recieveData({event:"word-selection", word:"sample", wordLength: 6, wordDifficulty: "hard", timer: 40});
    });

    it("Chat message parsing incorrect word does not award points", () =>{
      testGame.chatMessage({sender:"Player1", text:"This is incorrect"});
      assert.equal(0, testGame.scores["Player1"]);
    });

    it("Chat message parsing ignores drawing players input", () =>{
      testGame.chatMessage({sender:"Player2", text:"sample"});
      assert.equal(0, testGame.scores["Player2"]);
    });

    it("Chat message parsing awards points to correct answer", () =>{
      testGame.chatMessage({sender:"Player1", text:"Sample"});
      assert.equal(300, testGame.scores["Player1"]);
    });

    it("Ensure time out is handled correctly, turn order advances", (done) => {
      clientSocket.on("update-game-player", (data) => {
        if(data.event === "your-turn"){
            assert.equal("Player1",testGame.turnOrder[0]);
            assert.isNotNull(data.words);
            done();
        }
    });
    testGame.recieveData({event:"time-out"});
  });

});