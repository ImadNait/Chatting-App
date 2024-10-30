"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ws_1 = require("ws");
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const wsPort = process.env.WS_PORT;
const PORT = process.env.PORT;
const app = (0, express_1.default)();
console.log(wsPort);
app.use(express_1.default.json());
const server = new ws_1.Server({ port: 6000 });
app.get('/', (req, res) => {
    res.send('wsup niggaaa');
});
app.get('/home', (req, res) => {
    res.send('WELCOME HOME!!');
});
app.get('/about', (req, res) => {
    res.send('NOOO!!!');
});
app.listen(PORT, () => {
    console.log(`Server runnin on port ${PORT}`);
});
