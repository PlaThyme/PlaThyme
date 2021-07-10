import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import "./DrawingBoardStyles.css";

export default function DrawingBoard(props) {
  const [timeoutValue, setTimeoutValue] = useState(undefined);
  const socket = io.connect("http://localhost:3001");
  const colorsRef = useRef(null);

  const colourPalletDict = {
    black: "#000000",
    white: "#ffffff",
    darkGray: "#6e6e6e",
    lightGray: "#cccccc",
    maroon: "#4f0000",
    brown: "#854500",
    red: "#db0000",
    lightpink: "#fcbdf6",
    orange: "#fc8200",
    lightOrange: "#ffc60d",
    yellow: "#fff700",
    lightYellow: "#fffca1",
    green: "#198000",
    lightGreen: "#32ff00",
    blue: "#0011ff",
    lightBlue: "#00ecf0",
    indigo: "#271069",
    lightIndigo: "#8c93d1",
    purple: "#6e00e3",
    lightPurple: "#d9c5f0",
  };

  useEffect(() => {
    socket.on("canvas-data", (data) => {
      var image = new Image();
      var canvas = document.querySelector("#board");
      var ctx = canvas.getContext("2d");
      image.onload = () => {
        ctx.drawImage(image, 0, 0);
      };
      image.src = data;
    });
    socket.on("clear-canvas-data", (data) => {
      var canvas = document.querySelector("#board");
      var ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    });
  }, []);

  useEffect(() => {
    const colors = document.getElementsByClassName("color");
    const svgPencil = document.getElementById("svgPencil");
    const svgEraser = document.getElementById("svgEraser");
    const svgCleanBoard = document.getElementById("svgCleanBoard");
    var canvas = document.querySelector("#board");
    var ctx = canvas.getContext("2d");
    var sketch = document.querySelector("#sketch");
    var sketch_style = getComputedStyle(sketch);
    var mouse = { x: 0, y: 0 };
    var last_mouse = { x: 0, y: 0 };
    var lineWidthValue = 5;
    var strokeColor = "#000000";

    canvas.width = parseInt(sketch_style.getPropertyValue("width"));
    canvas.height = parseInt(sketch_style.getPropertyValue("height"));

    const handleCleanBoard = (e) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      socket.emit("clear-canvas-data", null);
    };

    const onColorUpdate = (e) => {
      console.log("--> ", e.target.className);
      strokeColor = colourPalletDict[e.target.className.split(" ")[1]];
    };
    for (let i = 0; i < colors.length; i++) {
      colors[i].addEventListener("click", onColorUpdate, false);
    }

    svgPencil.addEventListener(
      "click",
      () => {
        if (strokeColor === "#ffffff") strokeColor = "#000000";
      },
      false
    );
    svgEraser.addEventListener("click", () => (strokeColor = "#ffffff"), false);
    svgCleanBoard.addEventListener("click", handleCleanBoard, false);

    const onPaint = () => {
      ctx.beginPath();
      ctx.moveTo(last_mouse.x, last_mouse.y);
      ctx.lineTo(mouse.x, mouse.y);
      ctx.lineWidth = lineWidthValue;
      ctx.strokeStyle = strokeColor;
      // ctx.lineJoin = "round";
      // ctx.lineCap = "round";
      ctx.closePath();
      ctx.stroke();

      if (timeoutValue !== undefined) {
        clearTimeout(timeoutValue);
      }
      setTimeoutValue(
        setTimeout(() => {
          var base64ImageData = canvas.toDataURL("image/png"); // contains canvas images in coded fromat
          socket.emit("canvas-data", base64ImageData);
        }, 1000)
      );
    };

    canvas.addEventListener(
      "mousemove",
      function (e) {
        last_mouse.x = mouse.x;
        last_mouse.y = mouse.y;

        mouse.x = e.pageX - this.offsetLeft;
        mouse.y = e.pageY - this.offsetTop;
      },
      false
    );

    canvas.addEventListener(
      "mousedown",
      function (e) {
        canvas.addEventListener("mousemove", onPaint, false);
      },
      false
    );

    canvas.addEventListener(
      "mouseup",
      function () {
        canvas.removeEventListener("mousemove", onPaint, false);
      },
      false
    );
  }, []);

  return (
    <div className="grid-container mt-20">
      <div className="grid-item item-1 text-white">
        <p>Timer: 1:29</p>
      </div>
      <div className="grid-item item-2 text-white">
        <p>{props.currentWord}</p>
      </div>
      <div className="board-container sketch grid-item item-3" id="sketch">
        <canvas id="board" className="board" />
      </div>
      <div className="grid-item item-4 flex justify-between">
        <div ref={colorsRef} className="colors">
          <div className="color black odd" />
          <div className="color white  even" />
          <div className="color darkGray odd" />
          <div className="color lightGray even" />
          <div className="color maroon odd" />
          <div className="color brown even" />
          <div className="color red odd" />
          <div className="color lightpink even" />
          <div className="color orange odd" />
          <div className="color lightOrange even" />
          <div className="color yellow odd" />
          <div className="color lightYellow even" />
          <div className="color green odd" />
          <div className="color lightGreen even" />
          <div className="color blue odd" />
          <div className="color lightBlue even" />
          <div className="color indigo odd" />
          <div className="color lightIndigo even" />
          <div className="color purple odd" />
          <div className="color lightPurple even" />
        </div>
        <div className="canvasTools flex justify-items-end">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            className="bi bi-pencil-fill bg-white"
            viewBox="0 0 16 16"
            id="svgPencil"
          >
            <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-3-3zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207l6.5-6.5zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.499.499 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11l.178-.178z" />
          </svg>

          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            class="bi bi-eraser-fill bg-white"
            viewBox="0 0 16 16"
            id="svgEraser"
          >
            <path d="M8.086 2.207a2 2 0 0 1 2.828 0l3.879 3.879a2 2 0 0 1 0 2.828l-5.5 5.5A2 2 0 0 1 7.879 15H5.12a2 2 0 0 1-1.414-.586l-2.5-2.5a2 2 0 0 1 0-2.828l6.879-6.879zm.66 11.34L3.453 8.254 1.914 9.793a1 1 0 0 0 0 1.414l2.5 2.5a1 1 0 0 0 .707.293H7.88a1 1 0 0 0 .707-.293l.16-.16z" />
          </svg>

          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            className="bi bi-trash-fill bg-white"
            viewBox="0 0 16 16"
            id="svgCleanBoard"
          >
            <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z" />
          </svg>
        </div>
      </div>
    </div>
  );
}
