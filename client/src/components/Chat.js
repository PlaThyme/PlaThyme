import React from 'react';
import io from 'socket.io-client';
import { PaperAirplaneIcon } from "@heroicons/react/solid";

const Chat = (socket) => {
    function handleSend(e){
        e.preventDefault();
        document.getElementById('send-box').reset();
        console.log(socket);
    }

    return (
        <div className="flex flex-col">
            <div className="flex m-1 flex-grow bg-thyme-800">
                
            </div>
            <div class="chat-form-container pb-2">
                <form 
                className="flex"
                onSubmit={handleSend}
                id="send-box">
                    <input
                        className="w-40 text-md"
                        type="text"
                        placeholder="Enter Message"
                        required
                        autocomplete="off"
                    />
                    <button class="flex btn p-1 mx-2 text-sm bg-thyme-600 text-thyme-100 rounded">Send<PaperAirplaneIcon className="w-5 h-5 text-thyme-100" /></button>
                </form>
            </div>
        </div>
    )
}

export default Chat
