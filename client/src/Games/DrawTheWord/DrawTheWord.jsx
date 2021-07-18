import React from "react";

import DrawingBoard from "./DrawingBoard";

export default function DrawTheWord({ socket }) {
  return (
    <>
      <DrawingBoard socket={socket} />
    </>
  );
}
