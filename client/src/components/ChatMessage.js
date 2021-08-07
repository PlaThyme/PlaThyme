import "./GameRoom.css";
import React from "react";

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
        <div className="send-message pl-3 py-px">
          <div className="rounded bg-gray-100">
            <div>
              <div className="send-person text-red-700 mr-1">{message.sender}</div>
            </div>
            <div className="send-body">
              <p className="ml-1 text-thyme-800">
                {message.text}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="inc-message pr-3 py-px">
          <div className="pr-2 rounded bg-thyme-100">
            <p className="inc-person text-blue-700 ml-1">{message.sender}</p>
            <div className="inc-body">
              <p className="ml-1 text-thyme-800">
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
