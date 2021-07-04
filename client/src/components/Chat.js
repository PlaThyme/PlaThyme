import React from 'react'

const Chat = () => {
    return (
        <div class="chat-container">
            <div class="chat-form-container">
                <form className="">
                    <input
                        id="msg"
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
