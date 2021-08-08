import { useState, useEffect, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import "./GameRoom.css";
import io from "socket.io-client";

import ToolTip from "./ToolTip";
import Chat from "./Chat";

const GameRoom = ({
  gameInfo,
  currentPlayer,
  leaveGame,
  socket,
  children,
  displayPlayersList,
}) => {
  const [allUsers, setAllUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    socket.on("userData", (users) => {
      setAllUsers(users);
    });
    socket.on("message", (message) => {
      setMessages((messages) => [...messages, message]);
    });
  }, []);

  const handleLeaveGame = () => {
    socket.emit("leaveGame");
    leaveGame(false);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const openModal = () => {
    setIsOpen(true);
  };

  return (
    <div className="whole-room">
      <nav className="bg-gradient-to-r from-thyme-darkest via-thyme to-thyme-darkest p-3">
        <h1 className="float-left text-thyme-lightest text-3xl">
          {gameInfo.gameName}
        </h1>
        <div className="float-right">
          <ToolTip text="Copy to Clipboard">
            <button
              id="btn-cpy"
              className="inline text-thyme-lightest text-3xl border-2 rounded-lg px-2 hover:bg-thyme-darkest"
              onClick={() => {
                navigator.clipboard.writeText(gameInfo.roomCode);
              }}
            >
              Room Code: {gameInfo.roomCode}
            </button>
          </ToolTip>
        </div>
      </nav>
      <div className="game-and-sidebars">
        <div className="player-list bg-gray-900">
          <div>
            <div className="text-center bg-thyme">PLAYERS</div>
            <ul className="flex-col bg-gray-900 divide-y-4 divide-thyme divide-dashed content-center">
              {allUsers.map((player) => (
                <h1 className="text-xl text-center align-middle bg-gray-900 text-thyme-lightest p-2">
                  {player.name} : {player.score}
                </h1>
              ))}
            </ul>
          </div>
          <button
            onClick={openModal}
            className="text-thyme-lightest p-2 w-full text-xl rounded-t-lg bg-red-600 hover:bg-red-800"
          >
            Leave Room
          </button>
        </div>
        <div className="game-container">
          <div className="game-window bg-gray-800 overflow-auto">
            {children}
          </div>
        </div>
        <div className="chat-bar bg-gray-900">
          <div className="text-center bg-thyme">CHAT</div>
          <Chat
            socket={socket}
            messages={messages}
            currentPlayer={currentPlayer}
            className="flex-grow"
          />
        </div>
      </div>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-30 overflow-y-auto"
          onClose={closeModal}
        >
          <div className="min-h-screen px-4 text-center">
            <Transition.Child as={Fragment}>
              <Dialog.Overlay className="fixed inset-0 bg-gray-800 opacity-60" />
            </Transition.Child>

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
              <div className="inline-block max-w-sm p-4 my-5 overflow-hidden text-left align-middle transition-all transform bg-thyme-700 shadow-md rounded-lg">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-thyme-300"
                >
                  Exit the game?
                </Dialog.Title>
                <div className="mt-2">
                  <p className="text-md text-thyme-100">You sure 'bout that?</p>
                </div>

                <div className="mt-4">
                  <button
                    type="button"
                    className="justify-center px-4 py-2 text-sm font-medium shadow-md text-thyme-900 bg-thyme-100 rounded-md hover:bg-thyme-200"
                    onClick={handleLeaveGame}
                  >
                    Yeah, I'm sure
                  </button>
                  <button
                    type="button"
                    className="justify-center ml-2 px-4 py-2 text-sm font-medium shadow-md text-thyme-900 bg-thyme-100 rounded-md hover:bg-thyme-200"
                    onClick={closeModal}
                  >
                    On second thought...
                  </button>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export default GameRoom;
