import React from "react";
import { Link } from "react-router-dom";

const Comment = (props) => {
  return (
    <div>
      <Link to={"/profile/" + props._id} className="user-id">
        {props._id}
      </Link>
      <div className="user-name">{props.comment}</div>
    </div>
  );
};

export default Comment;
