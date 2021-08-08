import { useEffect, useRef } from "react";
import ChatMessage from "./ChatMessage";
import "./GameRoom.css";

const MessageFeed = ({messages, currentPlayer}) => {

  const endOfList = useRef();

  useEffect(() => {
    scrollDown()
  },[messages]);

  const scrollDown = () => {
    endOfList.current?.scrollIntoView({behavior:"smooth"});
  }

  return (
    <div className="message-feed">
      {messages.map((message) => (
          <ChatMessage message={message} currentPlayer={currentPlayer} />
      ))}
      <div ref={endOfList}></div>
    </div>
  );
};
export default MessageFeed;
