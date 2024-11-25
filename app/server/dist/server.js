"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// import express, { NextFunction, Request, Response } from 'express';
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const socket_io_1 = require("socket.io");
// const PORT = process.env.PORT
// const app: express.Express = express();
// app.use('/users', userRouter)
// app.use(express.json())
const io = new socket_io_1.Server(3000, {
    cors: {
        origin: ['http://localhost:8080'],
    },
});
io.on("connection", (socket) => {
    console.log(socket.id);
});
// app.get('/',(req: Request, res: Response, next: NextFunction)=>{
//     res.send('GET')
// })
// app.get('/home',(req: Request, res: Response, next: NextFunction)=>{
//     res.send('Home Page')
// })
// app.get('/about',(req: Request, res: Response, next: NextFunction)=>{
//     res.send('about us')
// })
// app.get('/contacts',(req: Request, res: Response, next: NextFunction)=>{
//     res.send('contacts')
// })
// app.listen(PORT,()=>{
//     console.log(`Server runnin on port ${PORT}`);
// })
