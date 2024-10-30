import { Router } from "express";
import { createUser, getUsers } from "../handlers/userHandler";

const router = Router()

router.get('/getUsers', getUsers)

router.post('/new', createUser)

export default router;