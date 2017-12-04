const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

app.use(express.static('public'));

io.on('connection', function(socket){
  if (io.sockets.server.eio.clientsCount > 2) {
    socket.emit('crowded', {name: 'chat_bot', message: 'Sorry, this chat is full', id: 'chat_bot'})
    socket.disconnect();
  } else {
    console.log('a user connected');
    socket.broadcast.emit('userConnected', {name: 'chat_bot', message: 'User connected', id: 'chat_bot'});

    socket.on('chat', message => {
      io.emit('chat', message);
    });

    socket.on('disconnect', function(){
      console.log('user disconnect')
      socket.broadcast.emit('userDisconnected', {name: 'chat_bot', message: 'User disconnected', id: 'chat_bot'});
    });

    socket.emit('ready', {name: 'chat_bot', message: 'You connected', id: 'chat_bot'})
  }
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
