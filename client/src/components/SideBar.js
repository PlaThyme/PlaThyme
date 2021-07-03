//PlayerList takes in an array of players and displays them in a list.
//TODO Make Leave Room button fuctional.
import { RadioGroup } from '@headlessui/react'
import { useState } from 'react'

const SideBar = ({players}) => {
    const [selected, setSelected] = useState('playersBtn')
    const [showPlayers, setPlayersChat] = useState(true)
    

    return (
        <div className="grid justify-items-center">
            <RadioGroup className="flex w-full" value={selected} onChange={setSelected}>
                <RadioGroup.Option value ="playersBtn" className ="flex w-3/6">
                    {({checked}) =>(
                        <button onClick={() => setPlayersChat(true)} className={`${checked ? "bg-thyme" : "bg-thyme-dark"} flex-grow p-2 w-3/6 text-2xl hover:bg-thyme-light rounded-b-lg`}>Players</button>
                    )}
                </RadioGroup.Option>
                <RadioGroup.Option value ="chatBtn" className ="flex w-3/6">
                    {({checked}) =>(
                        <button onClick={() => setPlayersChat(false)} className={`${checked ? "bg-thyme" : "bg-thyme-dark"} flex-grow p-2 w-3/6 text-2xl hover:bg-thyme-light rounded-b-lg`}>Chat</button>
                    )}
                </RadioGroup.Option>
            </RadioGroup>
            {showPlayers ?
                <ul className="bg-gray-900 divide-y-4 divide-thyme divide-dashed content-center">
                    {players.map((player) => (
                        <h1 className="text-xl text-center align-middle bg-gray-900 text-thyme-lightest p-2">
                        {player}
                    </h1>
                    ))}
                </ul>
                :
                <h1>Nope</h1>
            }
            <button className="text-thyme-lightest p-2 w-full text-2xl rounded-t-lg bg-red-600 hover:bg-red-800 absolute bottom-0 right-0">Leave Room</button>
        </div>
    )
}


export default SideBar
