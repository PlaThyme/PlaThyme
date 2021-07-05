const express = require("express");
const path = require("path");
const cors = require("cors");

const PORT = process.env.PORT || 3001;

const app = express();
const http = require('http').createServer(app)
app.use(cors());
//Get sockets running
const io = require('socket.io')(http);
//Upon connection, log the fact, emit nothing.
io.on('connection', (socket) => {
  console.log('Client Connected');
  socket.emit('connection', null);
  socket.on('canvas-data', (data) => {
    socket.broadcast.emit('canvas-data', data);
  })
});

http.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

app.use(express.static(path.resolve(__dirname, "../client/build")));