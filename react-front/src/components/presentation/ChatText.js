import React from "react";

const ChatText = (props) => {
  return (
    <div className={"message-content " + props.classname}>{props.message}</div>
  );
};

export default ChatText;
