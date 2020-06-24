import React, { useState, useEffect } from "react";
import { Post } from "../presentation";

const Home = () => {
  let allPosts;

  const [posts, setPosts] = useState("");

  useEffect(() => {
    fetch("/post", {
      method: "get",
      "Content-Type": "application/json",
      headers: {
        authorization: localStorage.getItem("token"),
        userid: localStorage.getItem("user")
          ? JSON.parse(localStorage.getItem("user"))._id
          : null,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          console.log(data.error);
          return;
        }
        setPosts(data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  if (posts) {
    console.log(posts);
    allPosts = posts.map((post) => (
      <Post
        filename={post.fileName}
        name={post.postedBy.name}
        likes={post.numLikes}
        comments={post.numComments}
        postId={post._id}
        userId={post.postedBy._id}
        isLiked={post.isLiked}
        key={post._id}
      />
    ));
  }

  return <div>{allPosts}</div>;
};

export default Home;
