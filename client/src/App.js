import React, { useState } from 'react';
import SelectGame from './components/SelectGame';
import './App.css';
import GameRoom from './components/GameRoom';
import WhiteBoardContainer from './Games/DrawTheWord/WhiteBoardContainer';

//Create socket.io client
import socketClient from "socket.io-client";
const SERVER = "http://localhost:3001";


const gameInfo = {
  name: "Enigma Breaker",
  roomName: "Cool Players Only",
  roomCode: "12345"
}
const playerInfo = ["Mike", "Vandana", "Zach", "David", "QuizMASTER"]

function App() {
  const [listofGames, setListofGames] = useState([
    {gameId: 1, gameName: "game 0", minPlayers: 4},
    {gameId: 2, gameName: "game 1", minPlayers: 3},
    {gameId: 3, gameName: "game 2", minPlayers: 2},
    {gameId: 4, gameName: "game 4", minPlayers: 1},
  ]);
  const [selectedGame, setSelectedGame] = useState({
    gameId: 0,
    gameName: "Game Name",
    minPlayers: "Min Players",
  });

  const handleSelectedGame = (gameName) => {
    console.log("selected game = ", gameName);
    setSelectedGame(gameName);
  }

  var socket = socketClient(SERVER);
  socket.on('connection', () => {
    console.log('Front and back end now connectted');
  });

  return (
    <div className="App font-mono bg-thyme-darkest">
      {/* <SelectGame handleSelectedGame={handleSelectedGame} listofGames={listofGames} /> */}
      <GameRoom gameInfo={gameInfo} playerInfo={playerInfo}>
        <WhiteBoardContainer />
      </GameRoom>
    </div>
  );
}

export default App;
