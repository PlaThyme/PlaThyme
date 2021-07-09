import React from 'react';

const ChatMessage = ({ message, currentPlayer}) => {

  let sentByCurrentUser = false;
  if (currentPlayer === message.sender) {
    sentByCurrentUser = true;
  }
  return (
    <div className="p-px">
      {sentByCurrentUser ? (
        <div className="pl-3">
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
        <div className="pr-3">
          <div className="flex flex-col pr-2 rounded bg-thyme-100">
            <p className="flex justify-start text-blue-700">{message.sender}</p>
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
