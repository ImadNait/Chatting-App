"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUsers = getUsers;
exports.createUser = createUser;
function getUsers(req, res) {
    res.send([]);
}
function createUser(req, res) {
    res.status(201).send({
        id: 3,
        name: "nigga",
        email: "hehe@gmail.com"
    });
}
