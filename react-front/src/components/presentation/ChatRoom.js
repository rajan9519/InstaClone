import React, { useEffect, useState } from "react";
import io from "socket.io-client";

let socket;

const ENDPOINT = "http://localhost:8000";

const ChatRoom = () => {
  const [message, setMessage] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  useEffect(() => {
    socket = io(ENDPOINT);
  }, [ENDPOINT]);

  useEffect(() => {
    socket.on("message", (data) => {
      console.log(data);
    });
  }, []);
  const send = (e) => {
    e.preventDefault();
    socket.emit("send", {
      to,
      from,
      message,
    });
  };
  const join = (e) => {
    e.preventDefault();
    socket.emit("join", from);
  };
  return (
    <div>
      <h1>You are in ChatRoom</h1>
      <input
        placeholder="send from"
        value={from}
        onChange={(e) => setFrom(e.target.value)}
        required
      />
      <button
        onClick={(e) => {
          join(e);
        }}
      >
        Join
      </button>
      <input
        placeholder="send something"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        required
      />
      <input
        placeholder="send to"
        value={to}
        onChange={(e) => setTo(e.target.value)}
        required
      />
      <button
        type="submit"
        onClick={(e) => {
          send(e);
        }}
      >
        Send
      </button>
    </div>
  );
};

export default ChatRoom;
