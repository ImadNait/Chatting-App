import { describe, it } from "node:test";
import { getUsers } from "../../handlers/userHandler";
import { mockRequest, mockResponse } from "../../__mocks__";



describe('getusers',()=>{
    it('should return an array of users',()=>{
    getUsers(mockRequest, mockResponse)
    expect(mockResponse.send).
    toHaveBeenCalledWith([]);
})
})