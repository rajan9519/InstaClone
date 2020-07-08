import React, { useEffect, useState, useContext } from "react";
import { useParams, Link } from "react-router-dom";
// import io from "socket.io-client";
import ChatText from "./ChatText";

import socket from "../../reducer/socketInstance";
import { AuthContext } from "../../App";

// const ENDPOINT = "http://localhost:8000";

let count = 0;

const ChatRoom = () => {
  const [message, setMessage] = useState("");
  const [recievedMessages, setRecievedMessages] = useState([]);

  const { state, dispatch } = useContext(AuthContext);

  const { recieverId } = useParams();

  // useEffect(() => {
  //   socket = io(ENDPOINT);
  //   count = 0;
  // }, [ENDPOINT]);

  useEffect(() => {
    socket.on("message", (data) => {
      console.log(...recievedMessages);
      //let msg = [...recievedMessages, data];
      setRecievedMessages((recievedMessages) => recievedMessages.concat(data));
      socket.emit("recieved", data._id);
    });
    socket.emit("join", state.user._id);
  }, []);
  const send = (e) => {
    e.preventDefault();
    socket.emit("send", {
      to: recieverId,
      from: state.user._id,
      message,
    });
    console.log(recievedMessages.length);
  };

  return (
    <div className="grid-container">
      <div className="sender-profile">{recieverId}</div>
      <div className="message-container">
        {recievedMessages.length
          ? recievedMessages.map((data) => {
              return (
                <ChatText
                  message={data.message}
                  classname={
                    data.senderId == state.user._id
                      ? "my-message"
                      : "other-message"
                  }
                  key={data._id}
                />
              );
            })
          : null}
      </div>
      <div className="type-box">
        <input
          placeholder="type here"
          className="chat-text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button className="btn" onClick={send}>
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatRoom;
