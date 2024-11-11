import dotenv from 'dotenv'


dotenv.config()

export const DEVELOPMENT = process.env.NODE_ENV === 'development';
export const TEST  = process.env.NODE_ENV === 'test'



export const SERVER_HOSTNAME = process.env.SERVER_HOSTNAME || 'localhost';
export const SERVER_PORT =  process.env.PORT ? Number(process.env.PORT) : 12345


export const SERVER = {
    SERVER_HOSTNAME,
    SERVER_PORT
}