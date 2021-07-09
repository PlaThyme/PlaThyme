import {useState, useEffect, useRef} from 'react';
import { PaperAirplaneIcon } from "@heroicons/react/solid";
import io from 'socket.io-client';

import MessageFeed from './MessageFeed';

const Chat = ({ socket, currentPlayer }) => {

    const [messages, setMessages] = useState([]);
    const messageRef = useRef();

    useEffect(() => {
        socket.on('message', message => {
          setMessages(messages => [ ...messages, message ]);
        });
    }, []);

    const handleSend = (e) => {
        e.preventDefault();
        if(messageRef.current.value){
            socket.emit('messageSend', {sender:currentPlayer, text:messageRef.current.value});
        }
        document.getElementById('send-box').reset();
    }
    
    return (
        <div className="flex-col">
            <div className="m-1 bg-thyme-800 overflow-scroll-y">
                <MessageFeed messages={messages} currentPlayer={currentPlayer}/>
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
