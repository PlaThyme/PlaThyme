import React, { Component } from "react";

import DrawingBoard from "./DrawingBoard";

export default function DrawTheWord({ socket }) {
  return (
    <>
      <DrawingBoard socket={socket} currentWord={"someWord"} />
    </>
  );
}
