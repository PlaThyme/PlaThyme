import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import "./DrawingBoardStyles.css";

export default function DrawingBoard() {
  const [timeoutValue, setTimeoutValue] = useState(undefined);
  const socket = io.connect("http://localhost:3001");
  const colorsRef = useRef(null);

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
    var strokeColor = "blue";

    canvas.width = parseInt(sketch_style.getPropertyValue("width"));
    canvas.height = parseInt(sketch_style.getPropertyValue("height"));

    const onColorUpdate = (e) => {
      strokeColor = e.target.className.split(" ")[1];
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
      ctx.lineJoin = "round";
      ctx.lineCap = "round";
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
    <div className="container">
      <div className="board-container sketch mt-8" id="sketch">
        <canvas id="board" className="board" />
      </div>
      <div ref={colorsRef} className="colors">
        <div className="color black" />
        <div className="color red" />
        <div className="color green" />
        <div className="color blue" />
        <div className="color yellow" />
      </div>
    </div>
  );
}
