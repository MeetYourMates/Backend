import { AppData, Socket } from './SocketTypes'
const bar = (app: AppData, socket: Socket<{}, any>) => {
  const handler = {
    bar1: bar1(app, socket),
    bar2: bar2(app, socket)
  }
  return handler
}

// Events
const bar1 = (app: AppData, socket: Socket<{}, any>) => (data:string) => {
  // Broadcast message to all sockets
  console.log('bar1', data)
}

const bar2 = (app: AppData, socket: Socket<{}, any>) => (data:string) => {
  // Reply to sender
  console.log('bar2', data)
  socket.emit('bar3', data)
  app.allSockets.forEach(soc => {
    soc.emit('bar3', data)
  })
}

export default bar
