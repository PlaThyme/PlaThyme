import {useState, useEffect} from 'react';
import "./GameRoom.css"
import io from 'socket.io-client';

import SideBar from "./SideBar";
import ToolTip from "./ToolTip";

const GameRoom = ({ gameInfo, currentPlayer, leaveGame, socket, children}) => {

  const [allUsers, setAllUsers] = useState([]);

  useEffect(() => {
    socket.on("userData", (users) => {
      setAllUsers(users);
    })
  }, []);
  
  return (
    <div className="whole-room">
      <nav className="bg-gradient-to-r from-thyme-darkest via-thyme to-thyme-darkest p-3">
        <h1 className="inline text-thyme-lightest text-3xl">
          {gameInfo.gameName}
        </h1>
        <div className="flex inline">
          <ToolTip text="Copy to Clipboard">
            <button
              id="btn-cpy"
              className="inline inline text-thyme-lightest text-3xl border-2 rounded-lg px-2 hover:bg-thyme-darkest"
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
        <div className="game-window bg-gray-800 overflow-auto">
          {children}
        </div>
        <div className="flex bg-gray-900">
          <div className="flex flex-none w-60">
            <SideBar currentPlayer={currentPlayer} allUsers={allUsers} leaveGame={leaveGame} socket={socket} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameRoom;
