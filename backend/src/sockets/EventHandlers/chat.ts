var Chat = function (app:any, socket:any) {
  this.app = app;
  this.socket = socket;

  // Expose handler methods for events
  this.handler = {
      message: message.bind(this), // use the bind function to access this.app
      ping:    ping.bind(this)    // and this.socket in events
  };
}

// Events

function message(text:any){
  // Broadcast message to all sockets
  this.app.allSockets.emit('message', text);
};

function ping() {
  // Reply to sender
  this.socket.emit('message', 'PONG!');
};

module.exports = Chat;