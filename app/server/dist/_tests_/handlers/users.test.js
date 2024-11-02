"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_test_1 = require("node:test");
const userHandler_1 = require("../../handlers/userHandler");
const __mocks__1 = require("../../__mocks__");
(0, node_test_1.describe)('getusers', () => {
    (0, node_test_1.it)('should return an array of users', () => {
        (0, userHandler_1.getUsers)(__mocks__1.mockRequest, __mocks__1.mockResponse);
        expect(__mocks__1.mockResponse.send).
            toHaveBeenCalledWith([]);
    });
});
