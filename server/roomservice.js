/** @type {SocketIO.Server} */
var _io;
var rmap;
var MAX_CLIENTS = 3;
/** @param {SocketIO.Socket} socket */
function listen(socket) {
    var io = _io;
    var rooms = io.nsps["/"].adapter.rooms;
    function createListeners(room) {
        socket.on("ready", function () {
            console.log("Ready in: ", room);
            socket.broadcast.to(room).emit("ready", socket.id);
        });
        socket.on("offer", function (id, message) {
            socket.to(id).emit("offer", socket.id, message);
        });
        socket.on("answer", function (id, message) {
            socket.to(id).emit("answer", socket.id, message);
        });
        socket.on("candidate", function (id, message) {
            socket.to(id).emit("candidate", socket.id, message);
        });
        socket.on("disconnect", function () {
            socket.broadcast.to(room).emit("bye", socket.id);
        });
        socket.join(room);
        console.log(io.nsps["/"].adapter.rooms);
    }
    // console.log(rooms);
    socket.on("join", function (room, data) {
        var numClients = 0;
        if (rooms[room]) {
            numClients = rooms[room].length;
        }
        else {
            rmap[room] = {
                host: socket.id,
                data: data
            };
            // The new member, first in the room is the Host
            // socket.emit('granted', socket.id, true);
            // createListeners(room);
        }
        if (numClients < MAX_CLIENTS) {
            // Delete these two lines if you want to enable permission.
            socket.emit("granted", socket.id);
            createListeners(room);
            // Enable Below Lines if you want permission before joining
            // // If there is a room already
            // if (rooms[room]) {
            //   // Request permission from the Host
            //   socket.to(rmap[room].host).emit('permission', socket.id, data);
            //   createListeners(room);
            //   // Upon Granted Permission, create Listner
            //   socket.on('granted', function (id) {
            //     console.log('SocketId from Message: ', id, 'My Id: ', socket.id);
            //     socket.to(id).emit('granted', id);
            //   });
            // }
        }
        else {
            socket.emit("full", room);
        }
    });
}
/** @param {SocketIO.Server} io */
module.exports = function (io, roomsmap) {
    _io = io;
    rmap = roomsmap;
    return { listen: listen };
};
