// import express, { NextFunction, Request, Response } from 'express';
import { config } from 'dotenv'
import userRouter from './routes/users'
config();
import { instrument } from '@socket.io/admin-ui';
import { Server } from 'socket.io';
// const PORT = process.env.PORT
// const app: express.Express = express();
// app.use('/users', userRouter)
// app.use(express.json())
let userCount = 0;
const io = new Server(4000, {
    cors: {
        origin: ['http://localhost:3000', 'https://admin.socket.io'],
        credentials:true
    },
});
io.on("connection", (socket) => {
    userCount++;
    io.emit("userCountUpdate", userCount);
    console.log(socket.id);
    console.log(`Current users: ${userCount}`);
    socket.on('custom', (message, room)=>{
        if(room === ''){
        socket.broadcast.emit('sendBack', message)
        console.log(message);
        }
        else{
        socket.to(room).emit('sendBack', message)
        }
    })
    socket.on('joinRoom',(room, cb)=>{
        socket.join(room)
        cb(`Joined ${room}`)
    })
    socket.on("disconnect", () => {
        userCount--;
        io.emit("userCountUpdate", userCount); // Broadcast updated user count
        console.log(`User disconnected: ${socket.id}`);
    });
    
})

instrument(io, { auth:false, mode:"development" });


// app.listen(PORT,()=>{
//     console.log(`Server runnin on port ${PORT}`);
    
// })
