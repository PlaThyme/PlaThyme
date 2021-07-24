import React from "react";

import DrawingBoard from "./DrawingBoard";

/**
 * 
 * @param {socket Object} socket - The socket object that user used to connect to server. 
 * @returns Drawing board, colour pallet, Timer and Current Word.
 */
export default function DrawTheWord({ socket }) {
  return (
    <>
      <DrawingBoard socket={socket} />
    </>
  );
}
