import { useState } from "react";
import ChatMessage from "./ChatMessage";

const MessageFeed = ({messages, currentPlayer}) => {
  // let messages1 = [{sender:"Duh", text:"crap"},{sender:"Duh", text:"crap"},{sender:"Duh", text:"crap"},{sender:"Duh", text:"crap"},{sender:"Duh", text:"crap"},{sender:"Duh", text:"crap"},{sender:"Duh", text:"crap"},{sender:"Duh", text:"crap"},{sender:"Duh", text:"crap"},{sender:"Duh", text:"crap"},{sender:"Duh", text:"crap"},{sender:"Duh", text:"crap"},{sender:"Duh", text:"crap"},{sender:"Duh", text:"crap"},{sender:"Duh", text:"crap"},{sender:"Duh", text:"crap"}]
  return (
    <div id="message-list" className="flex-col w-full overflow-y-auto bg-thyme-800">
      {messages.map((message) => (
          <ChatMessage message={message} currentPlayer={currentPlayer} />
      ))}
    </div>
  );
};
export default MessageFeed;
