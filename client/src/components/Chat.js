import {useState, useEffect, useRef} from 'react';
import io from 'socket.io-client';
import ChatMessage from './ChatMessage';
import { PaperAirplaneIcon } from "@heroicons/react/solid";

const Chat = ({socket, currentPlayer}) => {
    const [messages, setMessages] = useState([]);
    const messageRef = useRef();

    function handleSend(e){
        e.preventDefault();
        if(messageRef.current.value){
            socket.emit('messageSend', messageRef.current.value);
        }
        document.getElementById('send-box').reset();
        console.log(socket);
    }

    useEffect(() =>{
        socket.on('message', (message) => {
            let list = messages;
            list.push(message);
            setMessages(list);
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
                        id="chatBox"
                        placeholder="Chat Here"
                        required
                        ref = {messageRef}
                        autocomplete="off"
                    />
                    <button class="flex btn py1 pl2 mx-2 text-sm bg-thyme-600 text-thyme-100 rounded">Send<PaperAirplaneIcon className="w-5 h-5 text-thyme-100" /></button>
                </form>
            </div>
        </div>
    )
}

export default Chat
