const io = require('socket.io')(3002, {
    cors:{
        origin: 'http://localhost:3000',
    }
});

io.on('connection',(socket) => {
    console.log("a user connected: " + socket.id)

    socket.on('join_rooms', (data) => { 
        console.log(data)
        socket.join(data)
    })

    socket.on("send_message", (data) => {
        socket.to(data.room).emit('receive_message', data);
        console.log(data)
    })


    socket.on("disconnect", () => {
        console.log("User Disconnected: " + socket.id);
    })
})

