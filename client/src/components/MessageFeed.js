import { useEffect, useRef } from "react";
import ChatMessage from "./ChatMessage";

const MessageFeed = ({messages, currentPlayer}) => {

  const endOfList = useRef();

  useEffect(() => {
    scrollDown()
  },[messages]);

  const scrollDown = () => {
    endOfList.current?.scrollIntoView({behavior:"smooth"});
  }

  return (
    <div id="message-list" className="flex-col w-full overflow-y-auto bg-thyme-800">
      {messages.map((message) => (
          <ChatMessage message={message} currentPlayer={currentPlayer} />
      ))}
      <div ref={endOfList}></div>
    </div>
  );
};
export default MessageFeed;
