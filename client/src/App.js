import React, { useState, useEffect, Fragment, Component } from 'react';
import { Dialog, Transition } from "@headlessui/react";
import io from "socket.io-client";

import Carousel from './components/Carousel';
import SelectGame from './components/SelectGame';
import GameRoom from './components/GameRoom';
import WaitRoom from './components/WaitRoom';

import EnigmaBreaker from './Games/EnigmaBreaker/EnigmaBreaker';
import DrawTheWord from './Games/DrawTheWord/DrawTheWord';
import TestGame from './Games/TestGame/TestGame';

import './App.css';

const SERVER = "http://localhost:3001";
let socket;
let title;
let dialogText;
let buttonText;

export default function App() {

  const [currentPlayer, setCurrentPlayer] = useState("none");
  const [gameInfo, setGameInfo] = useState({
    gameName: null,
    minPlayers: null,
    roomCode: null,
  });
  const [startGame, setStartGame] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [listofGames, setListofGames] = useState([
    { gameId: 1, gameName: "Draw The Word", minPlayers: 3 },
    { gameId: 2, gameName: "TestGame", minPlayers: 3 },
    { gameId: 3, gameName: "game 2", minPlayers: 2 },
    { gameId: 4, gameName: "game 4", minPlayers: 1 },
  ]);
  const [selectedGame, setSelectedGame] = useState({
    gameId: 0,
    gameName: "Game Name",
    minPlayers: "Min Players",
  });
  const [inGame, setInGame] = useState(false);

  useEffect(() => {
    socket = io(SERVER);
    socket.on("connection", () => {});

    socket.on("gameData", (gameData) => {
      const name = listofGames.find(
        (id) => id.gameId === gameData.gameId
      ).gameName;
      setGameInfo({ gameName: name, minPlayers: gameData.minPlayers, roomCode: gameData.code });
      setInGame(true);
    });

    function openModal() {
      setIsOpen(true);
    }

    socket.on("error", (error) => {
      if (error.error === "dup") {
        title = "Error";
        dialogText = "User name is already in use in that game room";
        buttonText = "Dang...";
        openModal();
      }
      if (error.error === "gid") {
        title = "Error";
        dialogText = "Room code not valid";
        buttonText = "Typo?";
        openModal();
      }
      error = null;
    });

    return () => {
      
      socket.emit("disconnect");
      socket.off();
    }
  }, [SERVER]);

  useEffect(() => {
      socket.on("update-game", (data) => {
        if(data.event === "start-game"){
          console.log("*** Inside App.jsx ****")
          setStartGame(true);
        }
      })
  }, []);

  const closeModal = () => setIsOpen(false);

  const handleCreateGame = (playerName, selectedGame) => {
    setCurrentPlayer(playerName);
    const id = selectedGame.gameId;
    socket.emit("newRoom", { 
      name: playerName, 
      gameId: id, 
      minPlayers:  selectedGame.minPlayers
    });
  }

  const handleJoinGame = (playerName, roomCode) => {
    setCurrentPlayer(playerName);
    socket.emit("joinGame", { 
      name: playerName, 
      roomCode: roomCode 
    });
  }

  const handleSelectedGame = (gameName) => {
    setSelectedGame(gameName);
  };

  return (
    <div className="App font-mono bg-thyme-darkest">
      {inGame ? (
        <>
          <GameRoom
            gameInfo={gameInfo}
            currentPlayer={currentPlayer}
            leaveGame={setInGame}
            socket={socket}
          >
            { (gameInfo.gameName === "Draw The Word" && startGame === true) ? 
              <DrawTheWord socket={socket} />
              : (gameInfo.gameName === "Draw The Word" && startGame === false) ? 
              <WaitRoom />
              : <TestGame socket={socket}/> 
            }
          </GameRoom>
        </>
       ) : (
        <>
          <Carousel />
          <SelectGame
            handleSelectedGame={handleSelectedGame}
            listofGames={listofGames}
            createGame={handleCreateGame}
            joinGame={handleJoinGame}
          />
        </>
      )}
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-10 overflow-y-auto"
          onClose={closeModal}
        >
          <div className="min-h-screen px-4 text-center">
            <Transition.Child as={Fragment}>
              <Dialog.Overlay className="fixed inset-0" />
            </Transition.Child> 

            {/* This element is to trick the browser into centering the modal contents. */}
            <span
              className="inline-block h-screen align-middle"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-200"
              enterFrom="opacity-0 scale-50"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-50"
            >
              <div className="inline-block max-w-md p-4 my-5 overflow-hidden text-left align-middle transition-all transform bg-thyme-700 shadow-md rounded-lg">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-thyme-300"
                >
                  {title}
                </Dialog.Title>
                <div className="mt-2">
                  <p className="text-md text-thyme-100">{dialogText}</p>
                </div>

                <div className="mt-4 w-full flex">
                  <button
                    type="button"
                    className="px-4 py-2 text-sm font-medium shadow-md text-thyme-900 bg-thyme-100 rounded-md hover:bg-thyme-200"
                    onClick={closeModal}
                  >
                    {buttonText}
                  </button>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
}