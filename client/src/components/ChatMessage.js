import { useState } from "react";

const ChatMessage = ({ message, currentPlayer="Mike"}) => {
  let sentByCurrentUser = false;
  if(currentPlayer === message.sender){
    sentByCurrentUser = true;
  }
  return (
    <div className="p-px">
      {sentByCurrentUser ? (
        <div className="flex flex-col rounded bg-gray-100">
          <p className="flex justify-end text-thyme-700">{message.sender}</p>
          <div>
            <p className="flex justify-end text-thyme-800">{message.text}</p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col rounded bg-thyme-100">
          <p className="flex justify-start text-black">{message.sender}</p>
          <div className="flex">
            <p className="flex justify-start text-thyme-800">{message.text}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatMessage;
