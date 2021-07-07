import React, { useState, useEffect } from 'react';
import SelectGame from './components/SelectGame';
import './App.css';
import GameRoom from './components/GameRoom';

import {v4} from 'uuid'

//Create socket.io client
import io from "socket.io-client";
const SERVER = "http://localhost:3001";
let socket;


function App() {
  const [currentPlayer, setCurrentPlayer] = useState('none');
  const [gameInfo, setGameInfo] = useState({
    gameName: null,
    roomCode: null
  });

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

  const [inGame, setInGame] = useState(false);

  function handleCreateGame (playerName, selectedGame){
    setCurrentPlayer(playerName);
    const id = selectedGame.gameId;
    socket.emit('newRoom', {name:playerName,gameId:id});
  }

  function handleJoinGame (playerName, roomCode){
    setCurrentPlayer(playerName);
    socket.emit('joinRoom',{name:playerName,roomCode:roomCode});
  }

  const handleSelectedGame = (gameName) => {
    console.log("selected game = ", gameName);
    setSelectedGame(gameName);
  }

  useEffect(() => {
    socket = io(SERVER);
    console.log(socket);
    socket.on('connection', () => {
      
    });

    socket.on('gameData', (gameData) => {
      const name = listofGames.find((id) => id.gameId === gameData.gameId).gameName
      setGameInfo({gameName:name, roomCode:gameData.code})
      setInGame(true)
    } )

    return () => {
      socket.emit('disconnect');
      socket.off();
    }

  }, [SERVER]);
  


  return (
    <div className="App font-mono bg-thyme-darkest">
      {inGame ?
        <>
      <GameRoom gameInfo={gameInfo} currentPlayer={currentPlayer} leaveGame={setInGame} socket={socket}/>
        </>
      :
      <SelectGame handleSelectedGame={handleSelectedGame} listofGames={listofGames} createGame={handleCreateGame} joinGame={handleJoinGame}/>
    }
      </div>
  );
}

export default App;
