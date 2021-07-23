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

    it("Testing adding new player. Adding to turn order", () => {
        let player1 = {id:clientSocket.id, name:"Player1", gameId:"1", roomCode:"123456", score:0};
        let player2 = {id:clientSocket2.id, name:"Player2", gameId:"1", roomCode:"123456", score:0};
        let player3 = {id:clientSocket3.id, name:"Player3", gameId:"1", roomCode:"123456", score:0};
        joinRoom(player1);
        joinRoom(player2);
        joinRoom(player3);
        assert.equal("Player1",testGame.turnOrder[0]);
    });

    it("Testing end of turn", (done) => {
        clientSocket.on("update-game-player", (data) => {
            if(data.event === "your-turn"){
                assert.equal("Player1",testGame.turnOrder[0]);
                assert.isNotNull(data.words);
                done();
            }
        });
        testGame.recieveData({event:"end-turn"})
      });
    
    //   it("Joining a game", (done) => {
    //     serverSocket.on("update-game", (data) => {
          
    //     });
    //     clientSocket.emit("hi", (arg) => {
    //       assert.equal(arg, "hola");
    //       done();
    //     });
    // });
});