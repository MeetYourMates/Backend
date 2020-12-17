//Main Execution File of the Server
import app from './app'; //Exported App importing here
//Execute Connection to BDD before launching the Server
import './database';
import socketIoHandlers from './sockets/SocketHandler';
import debug = require('debug');
//Index.ts level constants
const packageJson = require('../package.json')
debug('ts-express:server')
//Error Handling - Server
const onError = (error: NodeJS.ErrnoException): void => {
    if (error.syscall !== 'listen') throw error
    let bind = (typeof port === 'string') ? 'Pipe ' + port : 'Port ' + port
    switch (error.code) {
      case 'EACCES':
        console.error(`${bind} requires elevated privileges`)
        process.exit(1)
      case 'EADDRINUSE':
        console.error(`${bind} is already in use`)
        process.exit(1)
      default:
        throw error
    }
  }
//Event Listening - Server
const onListening = (): void => {
    // tslint:disable-next-line:max-line-length
    console.log(`${packageJson.name} ${packageJson.version} listening on port ${port}!`)
    let addr = server.address()
    let bind = `port ${addr.port}`
    debug(`Listening on ${bind}`)
  }
//Iniciamos Server
var server = require('http').Server(app);
const port:Number = app.get('port');

server.on('error', onError);
server.on('listening', onListening);
//Socket IO --> socket.io handlers
//Only Websocket Connection Allowed, no Long Polling!
var io 		= require('socket.io')(server,{
  'transports': ['websocket']
});
// Socket.io all Events
socketIoHandlers(io);
server.listen(port);