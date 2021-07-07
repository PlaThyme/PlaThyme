import { useState } from "react";
import ChatMessage from "./ChatMessage";

const MessageFeed = ({messages, currentPlayer}) => {
  return (
    <div className="flex flex-col m-1 flex-grow bg-thyme-800">
      {messages.map((message) => (
          <ChatMessage message={message} currentPlayer={currentPlayer} />
      ))}
    </div>
  );
};
export default MessageFeed;
