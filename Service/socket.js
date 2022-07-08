let io;

const initIO = (server)=>{
    io = require ("socket.io")(server , {
        cors : "*"
    })
    return io
}

const getIO = ()=>{
    if (!io) {
        console.log({message : "in-valid io"});
    } else {
        return io  
    }
}

module.exports = {
    initIO,
    getIO
}