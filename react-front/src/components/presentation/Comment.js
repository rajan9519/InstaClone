import React, { useEffect, useState } from "react";
import Desk from "./Desk";

const Comment = (props) => {
  const [dispMore, setDispMore] = useState("none");
  const [btnText, setBtnText] = useState("");
  const [lessContent, setLessContent] = useState([]);
  const [moreContent, setMoreContent] = useState([]);
  const [showingAll, setShowingAll] = useState(false);
  const handleShow = () => {
    if (showingAll) {
      setShowingAll(false);
      setBtnText(`View all ${props.comments.length} comments`);
      setDispMore("none");
    } else {
      setShowingAll(true);
      setBtnText("View Less");
      setDispMore("inline");
    }
  };
  useEffect(() => {
    if (props.comments.length > 2) {
      setLessContent(props.comments.slice(0, 2));
      setMoreContent(props.comments.slice(2));
    } else {
      setLessContent(props.comments);
      setDispMore("none");
    }
    setBtnText(`View all ${props.comments.length} comment`);
  }, []);

  return (
    <div>
      <span>
        {lessContent.map((comment) => (
          <Desk
            key={comment._id}
            _id={comment.commentBy}
            text={comment.comment}
          />
        ))}
      </span>
      <span style={{ display: dispMore }}>
        {moreContent.map((comment) => (
          <Desk
            key={comment._id}
            _id={comment.commentBy}
            text={comment.comment}
          />
        ))}
      </span>
      <span style={{ display: moreContent.length ? "inline" : "none" }}>
        <button
          onClick={handleShow}
          style={{
            border: "none",
            background: "white",
            color: "gray",
            outline: "none",
            cursor: "pointer",
          }}
        >
          {btnText}
        </button>
      </span>
    </div>
  );
};

export default Comment;
