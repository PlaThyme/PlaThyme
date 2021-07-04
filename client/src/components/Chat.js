import React from 'react';
import io from 'socket.io-client';

const Chat = (socket) => {
    function handleSend(e){
        e.preventDefault();
        console.log(socket);
    }

    return (
        <div className="flex w-11/12 flex-col">
            <div className="flex-1 flex-grow w-full bg-gray-800">
                
            </div>
            <div class="flex chat-form-container pb-10">
                <form 
                onSubmit={handleSend}
                className="">
                    <input
                        className="h-20  flex-1 text-xs"
                        type="text"
                        placeholder="Enter Message"
                        required
                        autocomplete="off"
                    />
                    <button class="btn"><i class="fas fa-paper-plane"></i> Send</button>
                </form>
            </div>
        </div>
    )
}

export default Chat
