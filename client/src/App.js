import React, { useState } from 'react';
import SelectGameForm from './components/SelectGameForm';
import './App.css';

function App() {
  const [listofGames, setListofGames] = useState([
    {gameId: 1, gameName: "Decrypto", minPlayers: 4},
    {gameId: 2, gameName: "game 1", minPlayers: 4},
    {gameId: 3, gameName: "game 2", minPlayers: 4},
    {gameId: 4, gameName: "game 4", minPlayers: 4},
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
    <div className="App">
      <SelectGameForm handleSelectedGame={handleSelectedGame} listofGames={listofGames} />
    </div>
  );
}

export default App;
