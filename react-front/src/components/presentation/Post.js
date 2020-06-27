import React, { useState } from "react";
import icons from "../../assets";
import { Link } from "react-router-dom";

const Post = (props) => {
  const url = "/post/image/" + props.filename;
  const url2 =
    "https://instagram.fjai1-2.fna.fbcdn.net/v/t51.2885-19/s320x320/79967735_514903752444934_1105358873562185728_n.jpg?_nc_ht=instagram.fjai1-2.fna.fbcdn.net&_nc_ohc=tJTC28-_B6YAX9IxN5y&oh=d89568e3f4ed5c6389ac9ec8beea0729&oe=5F12AFDB";

  const [userName, setUserName] = useState(props.name);
  const [postId, setPostId] = useState(props.postId);
  const [userId, setUserId] = useState(props.userId);
  const [likes, setLikes] = useState(props.likes);
  const [comments, setComments] = useState(props.comments);
  const [text, setText] = useState("");
  const [isLiked, setIsLiked] = useState(props.isLiked);

  const handleLike = (e) => {
    e.preventDefault();
    setIsLiked(!isLiked);
    fetch("/post/like", {
      method: "put",
      body: JSON.stringify({
        postId,
        userId: JSON.parse(localStorage.getItem("user"))._id,
        isLiked,
      }),
      headers: {
        "Content-Type": "application/json",
        authorization: localStorage.getItem("token"),
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setLikes(data.numLikes);
        setIsLiked(data.isLiked);
      })
      .catch((err) => {
        console.log(err);
      });

    console.log("liked");
  };

  const handleComment = (e) => {
    e.preventDefault();
    fetch("/post/comment", {
      method: "put",
      body: JSON.stringify({
        postId,
        userId: JSON.parse(localStorage.getItem("user"))._id,
        text,
      }),
      headers: {
        "Content-Type": "application/json",
        authorization: localStorage.getItem("token"),
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setComments(data.numComments);
        setText("");
      })
      .catch((err) => {
        console.log(err);
      });

    console.log("commented");
  };

  return (
    <div
      style={{
        width: "80%",
        maxWidth: "600px",
        margin: "26px auto",
        border: "1px solid grey",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <img
            src={url}
            style={{
              width: "35px",
              height: "35px",
              borderRadius: "17px",
              marginLeft: "5px",
            }}
          />
          <Link
            to={"/profile/" + userId}
            style={{ marginLeft: "7px", textDecoration: "none" }}
          >
            {userName}
          </Link>
        </div>
        <button className="btn-icon">
          <i className="material-icons">more_horiz</i>
        </button>
      </div>
      <img src={url} style={{ width: "100%" }} />
      <div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div>
            <button
              className="btn-icon"
              onClick={(e) => {
                handleLike(e);
              }}
            >
              <i
                className="material-icons"
                style={{
                  color: isLiked ? "red" : "black",
                }}
              >
                {isLiked ? "favorite" : "favorite_border"}
              </i>
            </button>
            <button className="btn-icon">
              <i className="material-icons">comment</i>
            </button>
          </div>
          <button className="btn-icon">
            <i className="material-icons">bookmark_border</i>
          </button>
        </div>
        <div>
          <span>{likes} Likes</span>
        </div>
        <div>
          <div>
            <a>
              View all <span>{comments}</span> comments
            </a>
          </div>
        </div>
        <div>
          <a>1 hours ago</a>
        </div>
        <div>
          <form>
            <textarea
              placeholder="text"
              value={text}
              name="text"
              onChange={(e) => {
                setText(e.target.value);
              }}
            ></textarea>
            <button disabled={!text} onClick={(e) => handleComment(e)}>
              post
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Post;
