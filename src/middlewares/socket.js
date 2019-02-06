// @flow

import socketIO from 'socket.io';

import { verify } from '../helpers/passport';

import { saveTempItem } from './files';

function decodeToken(data): null | { id: string } {
  try {
    return verify(data.token);
  } catch (e) {
    return null;
  }
}

export default function connectSocketIO(server: any) {
  const io = socketIO(server, { origins: '*:*' });

  io.on('connection', (socket) => {
    let userId: string;

    socket.on('connectUser', (data) => {
      const user = decodeToken(data);

      if (user) {
        userId = user.id;
        socket.join(userId);
      }
    });

    socket.on('disconnect', () => {
      if (userId) socket.leave(userId);
    });

    socket.on('changeItem', (data) => {
      if (userId && data.item) {
        // emit change to all connected clients
        io.to(userId).emit('changeItem', { socket: socket.id, item: data.item });

        // save temporary item
        saveTempItem(userId, data.item);
      }
    });
  });
}
