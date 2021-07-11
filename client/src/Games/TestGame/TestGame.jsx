import React, { useState, useEffect } from "react";

export default function TestGame({ socket }) {
  const [colourName, setColourName] = useState("bg-blue-500");

  useEffect(() => {
    socket.emit("bg-colour-change", colourName);
  }, [colourName]);

  useEffect(() => {
    socket.on("bg-colour-change", (data) => {
      setColourName(data);
    });
  }, []);

  const handleColourNameChange = (colourValue) => {
    console.log(colourValue);
    if (colourValue === "blue") {
      setColourName("bg-blue-500");
    } else if (colourValue === "thyme") {
      setColourName("bg-thyme-500");
    } else {
      setColourName("bg-purple-500");
    }
  };

  return (
    <div className={"h-screen " + colourName}>
      <button
        class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={() => handleColourNameChange("blue")}
      >
        Blue
      </button>

      <button
        class="bg-thyme-600 hover:bg-thyme-700 text-white font-bold py-2 px-4 rounded"
        onClick={() => handleColourNameChange("thyme")}
      >
        Thyme
      </button>

      <button
        class="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
        onClick={() => handleColourNameChange("purple")}
      >
        purple
      </button>
    </div>
  );
}
