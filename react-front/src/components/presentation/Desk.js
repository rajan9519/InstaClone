import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Desk = (props) => {
  const [dispDot, setDispDot] = useState("none");
  const [dispMore, setDispMore] = useState("none");
  const [btnText, setBtnText] = useState("Read More");
  const [lessContent, setLessContent] = useState("");
  const [moreContent, setMoreContent] = useState("");

  const handleShow = () => {
    if (dispDot === "none") {
      setDispDot("inline");
      setBtnText("Read more");
      setDispMore("none");
    } else {
      setDispDot("none");
      setBtnText("Read Less");
      setDispMore("inline");
    }
  };
  useEffect(() => {
    if (props.text.length > 120) {
      setDispDot("inline");
      setLessContent(props.text.slice(0, 120));
      setMoreContent(props.text.slice(120));
    } else {
      setLessContent(props.text);
      setDispDot("none");
      setDispMore("none");
    }
  }, []);
  return (
    <div>
      <span>
        <Link to={"/profile/" + props._id} className="user-id">
          {props._id}
        </Link>
      </span>{" "}
      <span>{lessContent}</span>
      <span style={{ display: dispDot }}>...</span>
      <span style={{ display: dispMore }}>{moreContent}</span>
      <span style={{ display: moreContent ? "inline" : "none" }}>
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

export default Desk;
