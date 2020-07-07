import React, { useEffect, useState, useContext } from "react";
// import io from "socket.io-client";
import ChatText from "./ChatText";

import socket from "../../reducer/socketInstance";
import { AuthContext } from "../../App";

// const ENDPOINT = "http://localhost:8000";

let count = 0;

const ChatRoom = () => {
  const [message, setMessage] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [recievedMessages, setRecievedMessages] = useState([]);
  const { state, dispatch } = useContext(AuthContext);

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
    <div className="grid-container">
      <div className="sender-profile">Sender Name</div>
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
        <input placeholder="type here" className="chat-text" />
        <button className="btn">Send</button>
      </div>
    </div>
    // <div>
    //   <h1>You are in ChatRoom</h1>
    //   <input
    //     placeholder="send from"
    //     value={from}
    //     onChange={(e) => setFrom(e.target.value)}
    //     required
    //   />
    //   <button
    //     onClick={(e) => {
    //       join(e);
    //     }}
    //   >
    //     Join
    //   </button>
    //   <input
    //     placeholder="send something"
    //     value={message}
    //     onChange={(e) => setMessage(e.target.value)}
    //     required
    //   />
    //   <input
    //     placeholder="send to"
    //     value={to}
    //     onChange={(e) => setTo(e.target.value)}
    //     required
    //   />
    //   <button
    //     type="submit"
    //     onClick={(e) => {
    //       send(e);
    //     }}
    //   >
    //     Send
    //   </button>
    // {recievedMessages.length
    //   ? recievedMessages.map((data) => {
    //       return (
    //         <ChatText
    //           message={data.message}
    //           from={data.senderId}
    //           key={data._id}
    //         />
    //       );
    //     })
    //   : null}
    // </div>
  );
};

export default ChatRoom;
