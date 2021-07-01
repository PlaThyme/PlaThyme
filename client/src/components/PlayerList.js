import Player from "./Player"

const PlayerList = ({players}) => {
    return (
        <div>
            <h1 className="font-mono bg-thyme flex-grow text-center p-2 text-3xl">Players</h1>
            <div className="bg-gray-900">
                {players.map((player) => (
                    <Player name={player}/>
                ))}
            </div>
        </div>
    )
}

export default PlayerList
