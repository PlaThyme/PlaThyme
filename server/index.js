const path = require("path");
const express = require("express");
const PORT = process.env.PORT || 3001;
const app = express();
const http = require('http').createServer(app)


//Get sockets running
const io = require('socket.io')(http);

//Upon connection, log the fact, emit nothing.
io.on('connection', (socket) => {
  console.log('Client Connected');
  socket.emit('connection', null);
});

http.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

app.use(express.static(path.resolve(__dirname, "../client/build")));