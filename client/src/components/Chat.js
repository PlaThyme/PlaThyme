import React from 'react'

const Chat = () => {
    function handleSend(e){
        e.preventDefault();
    }

    return (
        <div className="flex w-11/12 flex-col">
            <div className="flex-1 flex-grow w-full bg-gray-800">
                
            </div>
            <div class="flex chat-form-container pb-10">
                <form 
                onSubmit={handleSend}
                className="">
                    <textarea
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
