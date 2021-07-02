//PlayerList takes in an array of players and displays them in a list.
//TODO Make Leave Room button fuctional.



const PlayerList = ({players}) => {
    return (
        <div className="grid justify-items-center">
            <button className="font-mono bg-thyme flex-grow p-2 text-2xl hover:bg-thyme-light rounded-b-lg">Players</button>
            <ul className="bg-gray-900 divide-y-4 divide-thyme divide-dashed content-center">
                {players.map((player) => (
                    <h1 className="text-xl text-center align-middle bg-gray-900 text-thyme-lightest p-2">
                    {player}
                </h1>
                ))}
            </ul>
            <button className="text-thyme-lightest p-2 w-full text-2xl rounded-t-lg bg-red-600 hover:bg-red-800 absolute bottom-0 right-0">Leave Room</button>
        </div>
    )
}

export default PlayerList
