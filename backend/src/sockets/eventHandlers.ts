import { Server } from 'socket.io'
import bar from './bar'
import foo from './foo'
import { AppData, Socket } from './SocketTypes'

// --------------------------------------
// -------- SOCKET.IO handlers ----------
// --------------------------------------

const app: AppData = {
  allSockets: []
}
var clients = 0;
// structure inspired by
// https://stackoverflow.com/questions/20466129/how-to-organize-socket-handling-in-node-js-and-socket-io-app
export default (io: Server) => {
  // Chatroom
  io.on('connection', (socket: Socket<any, any>) => {
    clients++;
    io.sockets.emit('broadcast',{ description: clients + ' clients connected!'});
    const eventHandlers = [
      foo(app, socket),
      bar(app, socket)
    ]

    // Bind events to handlers
    eventHandlers.forEach(handler => {
      for (let eventName in handler) {
        socket.on(eventName, handler[eventName])
      }
    })
    socket.on('disconnect', function () {
      clients--;
      io.sockets.emit('broadcast',{ description: clients + ' clients connected!'});
   });
    // Keep track of the socket
    app.allSockets.push(socket)
  })
}
