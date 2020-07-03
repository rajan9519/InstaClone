import React, { useEffect } from "react";
import io from "socket.io-client";

let socket;

const ENDPOINT = "http://localhost:8000";

const ChatRoom = () => {
  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("join", "rajan");
  }, [ENDPOINT]);
  return <h1>You are in ChatRoom</h1>;
};

export default ChatRoom;
