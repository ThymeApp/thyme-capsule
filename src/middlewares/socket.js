// @flow

import socketIO from 'socket.io';

export default function connectSocketIO(server: any) {
  const io = socketIO(server, { origins: '*:*' });

  io.on('connection', (socket) => {
    console.log(socket);
  });
}
