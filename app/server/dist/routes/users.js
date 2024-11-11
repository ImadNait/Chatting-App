"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userHandler_1 = require("../handlers/userHandler");
const router = (0, express_1.Router)();
router.get('/getUsers', userHandler_1.getUsers);
router.post('/new', userHandler_1.createUser);
exports.default = router;
