import React, { useState, useEffect } from "react";
import { io, Socket } from "socket.io-client";

export default function Chat() {
  const [message, setMsg] = useState("");
  const [messages, setMsgs] = useState<string[]>([""]);
  const [currentSockets, setCurrent] = useState<string[]>([""]);
  const [userCount, setUserCount]=useState<number>(0);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [room, setRoom] = useState("");
  const roomIn = document.getElementById("roomIn") as HTMLInputElement;
  useEffect(() => {
    const newSocket = io("http://localhost:4000");

    setSocket(newSocket);

    newSocket.on("connect", () => {
      setMsgs((prevMessages) => [
        ...prevMessages,
        `socket connected with id:${newSocket.id}`
      ]);


    });
    newSocket.on("sendBack", (message:string) => {
      setMsgs((prevMsg) => [...prevMsg, message]);
    });
    newSocket.on("userCountUpdate", (count: number) => {
        setUserCount(count);
    });
    return () => {
      newSocket.disconnect();
    };
  }, []);


  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    roomIn.value = "";
    if (message.trim() === "") {
      return;
    }

    if (socket) {
      setMsgs((prevMessages) => [...prevMessages, message]);
      setMsg("");
      console.log(message);
      socket.emit("custom", message, room);
    }
  };

  const joinRoom = () => {
    socket?.emit("joinRoom", room, (message: string) => {
      setMsgs([...messages, message]);
    });
    roomIn.value = "";
  };

  return (
    <div className="app">
      <div className="roomStatus">
      <p>Current users: {userCount}</p>
      {currentSockets.map((sckt, index) => (
            <div key={index} className="socket">
              {sckt}
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
          <label htmlFor="message-input">Message</label>
          <input
            type="text"
            name="msg"
            id="msgIn"
            placeholder="send something"
            onChange={(e) => setMsg(e.target.value)}
            value={message}
          />
          <button id="sendButton" type="submit">
            Send
          </button>
        </div>
        <div className="inputs">
          <label htmlFor="room-input">Room</label>
          <input
            type="text"
            id="roomIn"
            placeholder="join someone"
            onChange={(e) => setRoom(e.target.value)}
            value={room}
          />
          <button id="roomButton" onClick={joinRoom} type="button">
            Join
          </button>
        </div>
      </form>
    </div>
  );
}
