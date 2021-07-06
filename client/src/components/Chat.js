import {useState, useEffect} from 'react';
import io from 'socket.io-client';
import ChatMessage from './ChatMessage';
import { PaperAirplaneIcon } from "@heroicons/react/solid";

const Chat = ({socket, currentPlayer}) => {
    const [messages, setMessages] = useState([]);

    function handleSend(e){
        e.preventDefault();
        if(e.text){
            socket.emit('messageSend', e.text);
        }
        document.getElementById('send-box').reset();
        console.log(socket);
    }

    useEffect(() =>{
        socket.on('message', (message) => {
            setMessages(message => [...messages, message]);
        });
    },[]);

    return (
        <div className="flex flex-col">
            <div className="flex m-1 flex-grow bg-thyme-800">
                {messages.map((message, currentPlayer) => <div><ChatMessage message={message} playerName={currentPlayer}></ChatMessage></div>)}
            </div>
            <div class="chat-form-container pb-2">
                <form 
                className="pl-1 flex"
                onSubmit={handleSend}
                id="send-box">
                    <input
                        className="w-40 text-md"
                        type="text"
                        placeholder="Chat Here"
                        required
                        autocomplete="off"
                    />
                    <button class="flex btn py1 pl2 mx-2 text-sm bg-thyme-600 text-thyme-100 rounded">Send<PaperAirplaneIcon className="w-5 h-5 text-thyme-100" /></button>
                </form>
            </div>
        </div>
    )
}

export default Chat
