import React, { useState, useEffect } from 'react';
import SelectGame from './components/SelectGame';
import './App.css';
import GameRoom from './components/GameRoom';

import {v4} from 'uuid'

//Create socket.io client
import socketClient from "socket.io-client";
const SERVER = "http://localhost:3001";


const playerInfo = ["Mike", "Vandana", "Zach", "David", "QuizMASTER"]


function App() {
  const [gameInfo, setGameInfo] = useState({
    name: null,
    roomCode: null,
    playerName: null
  })

  const [listofGames, setListofGames] = useState([
    {gameId: 1, gameName: "Draw The Word", minPlayers: 3},
    {gameId: 2, gameName: "game 1", minPlayers: 3},
    {gameId: 3, gameName: "game 2", minPlayers: 2},
    {gameId: 4, gameName: "game 4", minPlayers: 1},
  ]);
  const [selectedGame, setSelectedGame] = useState({
    gameId: 0,
    gameName: "Game Name",
    minPlayers: "Min Players",
  });

  function handleCreateGame (playerName, selectedGame){
    console.log(playerName, selectedGame);
    const id = selectedGame.gameId;
    socket.emit('newRoom', {playerName,id});
  }

  function handleJoinGame (playerName, roomCode){
    console.log([playerName,roomCode])
  }

  const handleSelectedGame = (gameName) => {
    console.log("selected game = ", gameName);
    setSelectedGame(gameName);
  }

  var socket = socketClient(SERVER);
  socket.on('connection', () => {
    console.log('Front and back end now connectted');
  });

  socket.on('gameCode', (code) => {
    

  } )


  return (
    <div className="App font-mono bg-thyme-darkest">
      <SelectGame handleSelectedGame={handleSelectedGame} listofGames={listofGames} createGame={handleCreateGame} joinGame={handleJoinGame}/>
      <GameRoom gameInfo={gameInfo} playerInfo={playerInfo}/>
    </div>
  );
}

export default App;
