// const Server = require('socket.io');
// const io = new Server();

// let Socket = {
//   emit: function(event, data) {
//     console.log(event, data)
//     io.sockets.emit(event, data);
//   }
// };

// io.on('connection', (socket) => {
//   console.log('a user connected')
// });

// module.exports = { Socket, io }

let io;

module.exports = {
  init: (httpServer) => {
    io = require('socket.io')(httpServer);
    return io;
  },
  getIO: () => {
    if(!io) {
      throw new Error('Socket.io not initialized')
    }
    return io;
  },
}