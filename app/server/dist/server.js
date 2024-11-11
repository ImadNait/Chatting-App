"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = require("dotenv");
const users_1 = __importDefault(require("./routes/users"));
(0, dotenv_1.config)();
const wsPort = process.env.WS_PORT;
const PORT = process.env.PORT;
const app = (0, express_1.default)();
console.log(wsPort);
app.use('/users', users_1.default);
app.use(express_1.default.json());
app.get('/', (req, res, next) => {
    res.send('wsup niggaaa');
});
app.get('/home', (req, res, next) => {
    res.send('WELCOME HOME!!');
});
app.get('/about', (req, res, next) => {
    res.send('NOOO!!!');
});
app.get('/contacts', (req, res, next) => {
    res.send('CONTACT US');
});
app.listen(PORT, () => {
    console.log(`Server runnin on port ${PORT}`);
});
