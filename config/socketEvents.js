var socketio = require('socket.io'),
    io,
    socketCont = require('../controllers/socketController.js'),
    clients = {};


exports.socketStart= function (server){
      io = socketio.listen(server);

      io.sockets.on('connection', function (socket) {
        socket.emit('giveClient');

        socket.on('setUpClients', function (data) {
          console.log(data);
          socket.userId = data.user;
          console.log(socket.userId);
          clients[socket.userId] = socket;
        });

        socket.on('disconnect', function (){
          console.log(socket.userId);
          delete clients[socket.userId];
        });

        socket.on('joinGame', function (gameId){
          socketCont.joinGame(socket, gameId);
        });

        socket.on('leaveGame', function (roomId){
          socketCont.leaveGame(socket, roomId);
        });

        socket.on('playerSubmit', function(gameId){
          socketCont.updateSubmittedProp(socket, gameId);
        });
      });
};

exports.alertRoom = function(room){
  io.sockets.in(room).emit('otherPlayerSubmit');
};

exports.clients = clients;