import SideBar from "./SideBar";
import ToolTip from "./ToolTip";

const GameRoom = ({ gameInfo, playerInfo }) => {
  return (
    <div className="flex flex-col h-screen w-full">
      <nav className="flex bg-gradient-to-r from-thyme-darkest via-thyme to-thyme-darkest p-3 justify-between">
        <h1 className="inline text-thyme-lightest text-3xl">
          {gameInfo.name}
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
      <div className="relative flex inline h-full">
        <div className="grid justify-items-center bg-gray-800 flex-grow">
            <div className="m-auto">
                <div className="text-thyme-lightest">This is in the center!</div>
            </div>
        </div>
        
        <div className="relative w-60 bg-gray-900">
          <SideBar players={playerInfo} />
        </div>
      </div>
    </div>
  );
};

export default GameRoom;
