import PlayerList from "./PlayerList"

const GameRoom = ({gameInfo, playerInfo}) => {
    return (
        <div className="flex flex-col h-screen w-full">
            <nav className="flex bg-gradient-to-r from-thyme-darkest via-thyme to-thyme-darkest p-3 justify-between">
                <h1 className="font-mono inline text-thyme-lightest text-3xl">{gameInfo.name} - {gameInfo.roomName}</h1>
                <h1 className="font-mono inline text-thyme-lightest text-3xl">Room Code: {gameInfo.roomCode}</h1>
            </nav>
            <div className="flex inline h-full">
                <div className="bg-gray-800 flex-grow">
                    {/* Game goes here */}
                </div>
                <div className="relative w-60 bg-gray-900 border-solid border-4 border-thyme-dark">
                    <PlayerList players={playerInfo} />
                </div>
            </div>
        </div>
    )
}

export default GameRoom
