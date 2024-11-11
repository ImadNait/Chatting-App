import { Request, Response } from "express-serve-static-core";
import { newUserDto } from "../dtos/newUser.dto";
import { CreateUserQueryParams } from "../types/query-params";
import { user } from "../types/response";

export function getUsers(req:Request, res:Response){
    res.send([])
}

export function createUser(req:Request<{}, {}, newUserDto, CreateUserQueryParams>,
 res:Response<user>){

    res.status(201).send({
    id:3,
    name:"nigga",
    email:"hehe@gmail.com"
   })

}