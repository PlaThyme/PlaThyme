// import { render } from "@headlessui/react/dist/utils/render";
import React, { Component } from "react";
import io from "socket.io-client";
import "./WhiteBoardContainer.css";

export default class WhiteBoardContainer extends Component {
  timeout;
  socket = io.connect("http://localhost:3001");
  constructor(props) {
    super(props);

    this.socket.on("canvas-data", (data) => {
      var image = new Image();
      var canvas = document.querySelector("#board");
      // var canvas = document.getElementById("#board");
      var ctx = canvas.getContext("2d");
      image.onload = () => {
        ctx.drawImage(image, 0, 0);
      };
      image.src = data;
    });
  }

  componentDidMount() {
    this.drawOnCanvas();
  }

  // const [timeoutVariable, setTimeoutVariable] = useState(undefined);
  // const socket = io.connect("http://localhost:3001");

  drawOnCanvas() {
    var canvas = document.querySelector("#board");
    // var canvas = document.getElementById("#board");
    var ctx = canvas.getContext("2d");

    var sketch = document.querySelector("#sketch");
    // var sketch = document.getElementById("#sketch");
    var sketch_style = getComputedStyle(sketch);
    canvas.width = parseInt(sketch_style.getPropertyValue("width"));
    canvas.height = parseInt(sketch_style.getPropertyValue("height"));

    var mouse = { x: 0, y: 0 };
    var last_mouse = { x: 0, y: 0 };

    /* Mouse Capturing Work */
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

    /* Drawing on Paint App */
    ctx.lineWidth = 5;
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.strokeStyle = "blue";

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
    var root = this;
    var onPaint = function () {
      ctx.beginPath();
      ctx.moveTo(last_mouse.x, last_mouse.y);
      ctx.lineTo(mouse.x, mouse.y);
      ctx.closePath();
      ctx.stroke();

      if (root.timeout !== undefined) clearTimeout(root.timeout);
      root.timeout = setTimeout(() => {
        var base64ImageData = canvas.toDataURL("image/png"); // contains canvas images in coded fromat
        root.socket.emit("canvas-data", base64ImageData);
      }, 1000);
    };
  }

  render() {
    return (
      <div className="container">
        <div className="board-container sketch mt-8" id="sketch">
          <canvas id="board" className="board" />
        </div>
        <div className="color-picker-contsiner">
          <input type="color" />
        </div>
      </div>
    );
  }
}
