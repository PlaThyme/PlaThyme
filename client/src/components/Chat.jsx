import {useState, useEffect, useRef} from 'react';
import { PaperAirplaneIcon } from "@heroicons/react/solid";
import io from 'socket.io-client';
import "./GameRoom.css";

import MessageFeed from './MessageFeed';

const Chat = ({socket, currentPlayer, messages}) => {
    const messageRef = useRef();

    const handleSend = (e) => {
        e.preventDefault();
        if(messageRef.current.value){
            socket.emit('messageSend', {sender:currentPlayer, text:messageRef.current.value});
        }
        document.getElementById('send-box').reset();
    }
    
    return (
        <div className="chat-room">
            <div className="message-feed-container m-1">
                <MessageFeed messages={messages} currentPlayer={currentPlayer}/>
            </div>
            <div class="pb-2">
                <form 
                className="pl-1 chat-send"
                onSubmit={handleSend}
                id="send-box">
                    <input
                        className="chat-text-field text-md pl-1 rounded"
                        type="text"
                        id="chatBox"
                        placeholder="Chat Here"
                        maxLength="256"
                        required
                        ref = {messageRef}
                        autocomplete="off"
                    />
                    <button class="bg-thyme-600 px-2 ml-2 text-thyme-100 rounded">Send</button>
                </form>
            </div>
        </div>
    )
}

export default Chat
