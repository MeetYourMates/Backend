var Chat = function (app, socket) {
    this.app = app;
    this.socket = socket;
    // Expose handler methods for events
    this.handler = {
        message: message.bind(this),
        ping: ping.bind(this) // and this.socket in events
    };
};
// Events
function message(text) {
    // Broadcast message to all sockets
    this.app.allSockets.emit('message', text);
}
;
function ping() {
    // Reply to sender
    this.socket.emit('message', 'PONG!');
}
;
module.exports = Chat;
//# sourceMappingURL=chat.js.map