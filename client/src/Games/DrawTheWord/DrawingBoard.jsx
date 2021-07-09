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
  }, []);

  useEffect(() => {
    const colors = document.getElementsByClassName("color");
    var canvas = document.querySelector("#board");
    var ctx = canvas.getContext("2d");
    var sketch = document.querySelector("#sketch");
    var sketch_style = getComputedStyle(sketch);
    var mouse = { x: 0, y: 0 };
    var last_mouse = { x: 0, y: 0 };
    var lineWidthValue = 5;
    var strokeColor = "#0000FF";

    canvas.width = parseInt(sketch_style.getPropertyValue("width"));
    canvas.height = parseInt(sketch_style.getPropertyValue("height"));

    const onColorUpdate = (e) => {
      strokeColor = colourPalletDict[e.target.className.split(" ")[1]];
    };
    for (let i = 0; i < colors.length; i++) {
      colors[i].addEventListener("click", onColorUpdate, false);
    }

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
    <div className="grid-container mt-10">
      <div className="grid-item item-1 text-white">
        <p>Timer: 1:29</p>
      </div>
      <div className="grid-item item-2 text-white">
        <p>{props.currentWord}</p>
      </div>
      <div className="board-container sketch grid-item item-3" id="sketch">
        <canvas id="board" className="board" />
      </div>
      <div ref={colorsRef} className="colors grid-item item-4">
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
    </div>
  );
}
