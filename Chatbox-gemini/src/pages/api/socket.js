import { Server as NetServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (res.socket.server.io) {
    console.log('Socket is already running');
  } else {
    console.log('Socket is initializing');
    const httpServer = res.socket.server;
    const io = new SocketIOServer(httpServer, {
      path: '/api/socket',
    });
    res.socket.server.io = io;

    io.on('connection', socket => {
      socket.on('send-message', msg => {
        io.emit('new-message', msg);
      });
    });
  }
  res.end();
}
