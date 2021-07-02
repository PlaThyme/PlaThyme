import React, { useState } from 'react';
import SelectGame from './components/SelectGame';
import './App.css';
import GameRoom from './components/GameRoom';


const gameInfo = {
  name: "Enigma Breaker",
  roomName: "Cool Players Only",
  roomCode: "12345"
}
const playerInfo = ["Mike", "Vandana", "Zach", "David", "QuizMASTER"]

function App() {
  const [listofGames, setListofGames] = useState([
    {gameId: 1, gameName: "Decrypto", minPlayers: 4},
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

  return (
    <div className="App font-mono">
      <SelectGame handleSelectedGame={handleSelectedGame} listofGames={listofGames} />
      <GameRoom gameInfo={gameInfo} playerInfo={playerInfo}/>
    </div>
  );
}

export default App;
