import React, { useState, useEffect } from 'react';

const ChatMessage = ({ message, currentPlayer}) => {

  const [messageSender, setMessageSender] = useState("");

  useEffect(() => {
    setMessageSender(message.sender);
  }, [message]);

  let sentByCurrentUser = false;
  if (currentPlayer === message.sender) {
    sentByCurrentUser = true;
  }
  return (
    <div className="p-px">
      {sentByCurrentUser ? (
        <div className="pl-3 py-px">
          <div className="flex flex-col rounded bg-gray-100">
            <p className="flex justify-end text-red-700">{message.sender}</p>
            <div>
              <p className="flex justify-start text-thyme-800">
                {message.text}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="pr-3 py-px">
          <div className={`flex flex-col pr-2 rounded ${(messageSender === "*Warning*")? "bg-red-100" : "bg-thyme-100" } `}>
            <p className={`flex justify-start ${(messageSender === "*Warning*")? "text-red-700" : "text-blue-700" }`}>{message.sender}</p>
            <div className="flex">
              <p className="flex justify-start text-thyme-800">
                {message.text}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatMessage;
