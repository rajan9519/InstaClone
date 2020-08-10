import React, { useState, useEffect } from "react";
import icons from "../../assets";
import { Link } from "react-router-dom";
import Comment from "./Comment";
import {
  Dialog,
  DialogTitle,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@material-ui/core";
import Desk from "./Desk";

const Post = (props) => {
  const url =
    "https://instagram.fjai1-2.fna.fbcdn.net/v/t51.2885-19/s320x320/79967735_514903752444934_1105358873562185728_n.jpg?_nc_ht=instagram.fjai1-2.fna.fbcdn.net&_nc_ohc=tJTC28-_B6YAX9IxN5y&oh=d89568e3f4ed5c6389ac9ec8beea0729&oe=5F12AFDB";

  const [userName, setUserName] = useState(props.name);
  const [postId, setPostId] = useState(props.postId);
  const [userId, setUserId] = useState(props.userId);
  const [likes, setLikes] = useState(props.likes);
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
  const [isLiked, setIsLiked] = useState(props.isLiked);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetch("/post/comment/" + props.postId, {
      method: "get",
      "Content-Type": "application/json",
      headers: { authorization: localStorage.getItem("token") },
    })
      .then((res) => res.json())
      .then((data) => {
        setComments((comments) => data.concat(comments));
      })
      .catch((err) => console.log(err));
  }, [props.postId]);
  const handleLike = (e) => {
    e.preventDefault();
    setIsLiked(!isLiked);
    fetch("/post/like", {
      method: "put",
      body: JSON.stringify({
        postId,
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
        setComments((comments) => [data].concat(comments));
        setText("");
      })
      .catch((err) => {
        console.log(err);
      });

    console.log("commented");
  };

  const handleDeletePost = (e) => {
    e.preventDefault();
    fetch("/post/delete/" + postId, {
      method: "delete",
      headers: { authorization: localStorage.getItem("token") },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          console.log(data.error);
        } else {
          console.log(data.message);
          props.filter(postId);
        }
        setOpen(false);
      })
      .catch((error) => {
        console.log(error);
        setOpen(false);
      });
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
            src={props.dpUrl}
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
        {JSON.parse(localStorage.getItem("user"))._id == userId && (
          <div>
            <button
              className="btn-icon"
              onClick={() => {
                setOpen(true);
              }}
            >
              <i className="material-icons">delete</i>
            </button>

            <Dialog
              onClose={() => setOpen(false)}
              aria-labelledby="simple-dialog-title"
              open={open}
            >
              <DialogTitle id="simple-dialog-title">
                Cofirm Deleting Post
              </DialogTitle>
              <List component="nav" aria-label="main mailbox folders">
                <ListItem button onClick={handleDeletePost}>
                  <ListItemText primary="Confirm" />
                </ListItem>
                <Divider />
                <ListItem button>
                  <ListItemText
                    primary="Cancel"
                    onClick={() => {
                      setOpen(false);
                    }}
                  />
                </ListItem>
              </List>
            </Dialog>
          </div>
        )}
      </div>
      <img src={props.postUrl} style={{ width: "100%" }} />
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
        <Desk _id={userId} text={props.text} />
        <div>
          <div>
            <a>
              View all <span>{comments.length}</span> comments
            </a>
            <div className="comments">
              {comments.length
                ? comments.map((comment) => (
                    <Comment
                      key={comment._id}
                      _id={comment.commentBy}
                      comment={comment.comment}
                    />
                  ))
                : null}
            </div>
          </div>
        </div>
        <div>
          <a>{props.time}</a>
        </div>
        <div>
          <form className="comment-form">
            <textarea
              className="comment"
              placeholder="Comment"
              value={text}
              name="text"
              onChange={(e) => {
                setText(e.target.value);
              }}
            ></textarea>
            <button
              className="btn"
              disabled={!text}
              onClick={(e) => handleComment(e)}
            >
              post
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Post;
