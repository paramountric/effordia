// socket.js
import {Server} from 'Socket.IO';

const SocketHandler = (req, res) => {
  if (res.socket.server.io) {
    console.log('Socket is already running');
  } else {
    console.log('Socket is initializing');
    const io = new Server(res.socket.server);
    res.socket.server.io = io;

    io.on('connection', socket => {
      socket.broadcast.emit('update', 'connected');
      socket.on('input-change', msg => {
        socket.broadcast.emit('set-data', msg);
      });
      socket.on('set-data', msg => {
        console.log('this worked');
      });
    });
  }
  res.end();
};

export default SocketHandler;
