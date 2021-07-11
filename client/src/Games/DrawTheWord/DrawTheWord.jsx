import React, { useState } from "react";

import DrawingBoard from "./DrawingBoard";

export default function DrawTheWord({ socket }) {
  const [currentWord, setCurrentWord] = useState("someWord");

  return (
    <>
      <DrawingBoard socket={socket} currentWord={currentWord} />
    </>
  );
}
