import React, { useState, useEffect } from "react";
import { Post } from "../presentation";

const Home = () => {
  let allPosts;

  const [posts, setPosts] = useState("");

  useEffect(() => {
    fetch("/post", {
      method: "get",
      headers: { authorization: localStorage.getItem("token") },
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
        name={JSON.parse(post.postedBy).name}
        likes={post.numLikes}
        postId={post._id}
        userId={JSON.parse(post.postedBy)._id}
        key={post._id}
      />
    ));
  }

  return <div>{allPosts}</div>;
};

export default Home;
