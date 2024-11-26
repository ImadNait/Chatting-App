import { Server } from "socket.io";

let userCount = 0;

interface User {
    username: string;
    socketId: string;
    friends: string[];
    room?:string;
  }
const users: Record<string, User> = {}; 
const friendRequests: Record<string, string[]> = {}; 
const rooms: Record<string, Set<string>> = {};

const io = new Server(4000, {
  cors: {
    origin: ["http://localhost:3000", "https://admin.socket.io"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  userCount++;
  io.emit("userCountUpdate", userCount);

  socket.on("setUsername", (username:string) => {
    users[socket.id] = {
        username,
        socketId: socket.id, 
        friends: [],        
      };
      friendRequests[username] = []; 
    console.log(`User connected: ${username}`);
  });

  socket.on("joinRoom", (room, callback) => {
    const username = users[socket.id]?.username || socket.id;
    if (!rooms[room]) rooms[room] = new Set();
    rooms[room].add(username);
    const oldRoom = users[socket.id]?.room;
    if (oldRoom && rooms[oldRoom]) {
      rooms[oldRoom].delete(username);
      io.to(oldRoom).emit("roomMembersUpdate", Array.from(rooms[oldRoom]));
    }

    socket.join(room);
    users[socket.id].room = room;
    io.to(room).emit("roomMembersUpdate", Array.from(rooms[room]));
    callback(`Joined room: ${room}`);
  });

  socket.on("custom", (message, room) => {
    const username = users[socket.id]?.username || "Unknown";
    const formattedMessage = `${username}: ${message}`;
    if (room === "") {
      socket.broadcast.emit("sendBack", formattedMessage);
    } else {
      socket.to(room).emit("sendBack", formattedMessage);
    }
  });
  socket.on("sendFriendRequest", (toUsername) => {
    const fromUsername = users[socket.id]?.username;
    if (fromUsername && friendRequests[toUsername]) {
      friendRequests[toUsername].push(fromUsername);

      const receiverSocketId = Object.keys(users).find(
        (id) => users[id]?.username === toUsername
      );
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("friendRequestReceived", fromUsername);
      }
    }
  });

  socket.on("acceptFriendRequest", (fromUsername:string) => {
    const toUser = users[socket.id];
    if (!toUser || !fromUsername) {
        console.log(`Cannot accept friend request: User not found.`);
        return;
      }
  
 
      const fromSocketId = Object.keys(users).find(
        (id) => users[id]?.username === fromUsername
      );
      if (fromSocketId) {
        const fromUser = users[fromSocketId];
        if (!fromUser.friends.includes(toUser.username)) {
            fromUser.friends.push(toUser.username);
          }
          if (!toUser.friends.includes(fromUser.username)) {
            toUser.friends.push(fromUsername);
          }
          io.to(fromSocketId).emit("updateFriends", fromUser.friends);
          io.to(socket.id).emit("updateFriends", toUser.friends);
    
          console.log(
            `${fromUser.username} and ${toUser.username} are now friends.`
          );


      }


      friendRequests[toUser.username] = friendRequests[toUser.username].filter(
        (req) => req !== fromUsername
      );
    
  });

  socket.on("getFriends", () => {
    const username = users[socket.id]?.username;
    if (username) {
      const friends = users[socket.id].friends;
      io.emit("updateFriends", friends);
    }
  });
  



  socket.on("disconnect", () => {
    userCount--;
    const username = users[socket.id]?.username || socket.id;
    const room = users[socket.id]?.room;

    if (room && rooms[room]) {
      rooms[room].delete(username);
      io.to(room).emit("roomMembersUpdate", Array.from(rooms[room]));
    }

    delete users[socket.id];
    io.emit("userCountUpdate", userCount);
  });
});
