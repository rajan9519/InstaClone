import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import ChatText from "./ChatText";

let socket;

const ENDPOINT = "http://localhost:8000";

let count = 0;

const ChatRoom = () => {
  const [message, setMessage] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [recievedMessages, setRecievedMessages] = useState([]);

  useEffect(() => {
    socket = io(ENDPOINT);
    count = 0;
  }, [ENDPOINT]);

  useEffect(() => {
    socket.on("message", (data) => {
      console.log(...recievedMessages);
      //let msg = [...recievedMessages, data];
      setRecievedMessages((recievedMessages) =>
        recievedMessages.concat(data.data)
      );
      socket.emit("recieved", data._id);
    });
    socket.on("pending", (data) => {
      setRecievedMessages((recievedMessages) =>
        recievedMessages.concat(data.data)
      );
    });
  }, []);
  const send = (e) => {
    e.preventDefault();
    socket.emit("send", {
      to: to.trim(),
      from: from.trim(),
      message,
    });
    console.log(recievedMessages.length);
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
      {recievedMessages.length
        ? recievedMessages.map((data) => {
            return (
              <ChatText
                message={data.message}
                from={data.senderId}
                key={data._id}
              />
            );
          })
        : null}
    </div>
  );
};

export default ChatRoom;
