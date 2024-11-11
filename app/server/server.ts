import express, { NextFunction, Request, Response } from 'express';
import { Server } from 'ws';
import { config } from 'dotenv'
import userRouter from './routes/users'
import { user } from './types/response';
config();
const wsPort = process.env.WS_PORT
const PORT = process.env.PORT
const app: express.Express = express();
console.log(wsPort);
app.use('/users', userRouter)
app.use(express.json())
app.get('/',(req: Request, res: Response, next: NextFunction)=>{
    res.send('GET')
})
app.get('/home',(req: Request, res: Response, next: NextFunction)=>{
    res.send('Home Page')
})
app.get('/about',(req: Request, res: Response, next: NextFunction)=>{
    res.send('about us')
})
app.get('/contacts',(req: Request, res: Response, next: NextFunction)=>{
    res.send('contacts')
})

app.listen(PORT,()=>{
    console.log(`Server runnin on port ${PORT}`);
    
})
