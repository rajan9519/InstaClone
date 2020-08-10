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

  const filter = (postId) => {
    setPosts((posts) => posts.filter((post) => post._id != postId));
  };

  if (posts) {
    console.log(posts);
    allPosts = posts.map((post) => (
      <Post
        postUrl={post.picture.secure_url}
        name={post.postedBy.name}
        likes={post.numLikes}
        postId={post._id}
        userId={post.postedBy._id}
        isLiked={post.isLiked}
        key={post._id}
        dpUrl={
          post.postedBy.dp.secure_url
            ? post.postedBy.dp.secure_url
            : "https://res.cloudinary.com/rajan9519/image/upload/v1595414068/insta/default-dp_fv73wk.png"
        }
        filter={filter}
      />
    ));
  }

  return <div>{allPosts}</div>;
};

export default Home;
