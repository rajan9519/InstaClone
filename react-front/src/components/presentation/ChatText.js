import React from "react";

const ChatText = (props) => {
  return (
    <div>
      <div style={{ fontWeight: "bold" }}>{props.from} </div>
      <div>{props.message}</div>
    </div>
  );
};

export default ChatText;
