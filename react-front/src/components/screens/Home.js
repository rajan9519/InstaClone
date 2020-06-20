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
        setPosts(data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  if (posts) {
    allPosts = posts.map((post) => (
      <Post filename={post.filename} key={post._id} />
    ));
  }

  return <div>{allPosts}</div>;
};

export default Home;
