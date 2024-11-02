"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var userHandler_1 = require("../handlers/userHandler");
var router = (0, express_1.Router)();
router.get('/getUsers', userHandler_1.getUsers);
router.post('/new', userHandler_1.createUser);
exports.default = router;
