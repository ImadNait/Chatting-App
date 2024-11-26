import React, { useState, useEffect } from "react";
import { io, Socket } from "socket.io-client";

export default function Chat() {
  const [message, setMsg] = useState("");
  const [messages, setMsgs] = useState<string[]>([]);
  const [userCount, setUserCount] = useState<number>(0);
  const [room, setRoom] = useState("");
  const [roomMembers, setRoomMembers] = useState<string[]>([]);
  const [friends, setFriends] = useState<string[]>([]);
  const [username, setUsername] = useState("");
  const [socket, setSocket] = useState<Socket | null>(null);
  const [friendRequests, setFriendRequests] = useState<string[]>([]); 

  
  useEffect(() => {
    const newSocket = io("http://localhost:4000");
    setSocket(newSocket);

    newSocket.on("connect", () => {
      const userName = prompt("Enter your username") || `User ${newSocket.id}`;
      setUsername(userName);
      newSocket.emit("setUsername", userName);
    });

    newSocket.on("sendBack", (message) => {
      setMsgs((prevMsg) => [...prevMsg, message]);
    });

    newSocket.on("userCountUpdate", (count) => {
      setUserCount(count);
    });

    newSocket.on("roomMembersUpdate", (members:string[]) => {
      console.log("Current room members: ", members);
      setRoomMembers(members);
    });

    const customConfirm = (message:string) => {
      return window.confirm(message);
    };
    
    
    newSocket.on("friendRequestReceived", (fromUsername) => {
      alert(`Friend request received from ${fromUsername}`);
      if (customConfirm("Do you want to proceed?")) {
        newSocket.emit("acceptFriendRequest", fromUsername);
        alert(`${fromUsername} is now your friend!`);
      } else {
        console.log("friend request rejected sucessfully!");
        setFriends([]);
      }
    });
  
    newSocket.on("friendRequestAccepted", (friendUsername:string) => {
      alert(`${friendUsername} accepted your friend request`);
      setFriends((prev) => [...prev, friendUsername]);
    });
  
    newSocket.on("updateFriends", (friendsList) => {
      setFriends(friendsList);
    });




    return () => {
      newSocket.disconnect();
    };
  }, []);



  useEffect(() => {
    if (socket) {

      socket.on("updateFriends", (friendsList: string[]) => {
        setFriends(friendsList); 
      });
  

      socket.on("friendRequestReceived", (fromUsername: string) => {
        setFriendRequests((prevRequests) => [...prevRequests, fromUsername]);
        setFriends([...friends, fromUsername]);
      });
  

      socket.on("friendRequestAccepted", (friend: string) => {
        setFriends((prevFriends) => [...prevFriends, friend]);
      });
    }
  
    return () => {
      socket?.off("updateFriends");
      socket?.off("friendRequestReceived");
      socket?.off("friendRequestAccepted");
    };
  }, [socket]);
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (message.trim() === "") return;
    if (socket) {
      setMsgs((prevMessages) => [...prevMessages, `You: ${message}`]);
      setMsg("");
      socket.emit("custom", message, room);
    }
  };

  const joinRoom = () => {
    if (socket && room.trim() !== "") {
      socket.emit("joinRoom", room, (message: string) => {
        setMsgs([...messages, message]);
        setRoomMembers([]);
      });
    }
  };

  const startPrivateChat = (friend: string) => {
    setRoom(friend);
    if (socket) {
      socket.emit("joinRoom", friend, (message: string) => {
        setMsgs([...messages, message]);
      });
    }
  };
  const sendFriendRequest = (toUsername: string) => {
    socket?.emit("sendFriendRequest", toUsername);
  };
  
  const fetchFriends = () => {
    socket?.emit("getFriends");
  };
  
  useEffect(() => {
    fetchFriends();
  }, [socket]);

  return (
    <div className="app">
      <div className="roomStatus">
        <p>All Current users: {userCount}</p>
        <h4>Room Members</h4>
        {roomMembers
          .filter((member) => member !== username)
          .map((member, index) => (
            <div key={index}>
              {member}
              <button onClick={() => sendFriendRequest(member)}>Add Friend</button>
            </div>
          ))}

      </div>
      <div className="friendsList">
        <h4>Friends</h4>
        {friends.map((friend, index) => (
          <div>
          {friend}
          <button key={index} onClick={() => startPrivateChat(friend)}>
            Chat 
          </button>
          </div>
        ))}
      </div>
      <form id="form" onSubmit={handleSubmit}>
        <div id="message-cont">
          {messages.map((msg, index) => (
            <div key={index} className="message">
              {msg}
            </div>
          ))}
        </div>
        <div className="inputs">
          <input
            type="text"
            id="msgIn"
            placeholder="Type a message"
            onChange={(e) => setMsg(e.target.value)}
            value={message}
          />
          <button type="submit">Send</button>
        </div>
        <div className="inputs">
          <input
            type="text"
            id="roomIn"
            placeholder="Enter room name"
            onChange={(e) => setRoom(e.target.value)}
            value={room}
          />
          <button onClick={joinRoom} type="button">
            Join Room
          </button>
        </div>
      </form>
    </div>
  );
}
