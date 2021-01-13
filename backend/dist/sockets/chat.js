"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// TODO: use class or curry fn?
const foo = (app, socket) => ({
    foo1: foo1(app, socket), foo2: foo2(app, socket)
});
const foo1 = (app, socket) => (data) => {
    console.log('foo1', data);
};
const foo2 = (app, socket) => (data) => {
    // Reply to sender
    console.log('foo2', data);
    socket.emit('foo3', data);
    app.allSockets.forEach(soc => {
        soc.emit('foo3', data);
    });
};
exports.default = foo;
//# sourceMappingURL=chat.js.map