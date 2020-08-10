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

  const calculateTime = (createdAt) => {
    createdAt = new Date(createdAt);
    const current = new Date();

    let num_seconds = (current - createdAt) / 1000;

    const years = Math.floor(num_seconds / (60 * 60 * 24 * 365));
    num_seconds -= years * (60 * 60 * 24 * 365);
    const months = Math.floor(num_seconds / (60 * 60 * 24 * 30));
    num_seconds -= months * (60 * 60 * 24 * 30);
    const days = Math.floor(num_seconds / (60 * 60 * 24));
    num_seconds -= days * (60 * 60 * 24);
    const hours = Math.floor(num_seconds / (60 * 60));
    num_seconds -= hours * (60 * 60);
    const minutes = Math.floor(num_seconds / 60);
    num_seconds -= minutes * 60;

    num_seconds = Math.floor(num_seconds);

    let timeElapsed = "";

    if (years) {
      if (years > 1) {
        timeElapsed = years + " years ago";
      } else {
        timeElapsed = years + " year ago";
      }
    } else if (months) {
      if (months > 1) {
        timeElapsed = months + " months ago";
      } else {
        timeElapsed = months + " month ago";
      }
    } else if (days) {
      if (days > 1) {
        timeElapsed = days + " days ago";
      } else {
        timeElapsed = days + " day ago";
      }
    } else if (hours) {
      if (hours > 1) {
        timeElapsed = hours + " hours ago";
      } else {
        timeElapsed = hours + " hour ago";
      }
    } else if (minutes) {
      if (minutes > 1) {
        timeElapsed = minutes + " minutes ago";
      } else {
        timeElapsed = minutes + " minute ago";
      }
    } else {
      if (num_seconds > 1) {
        timeElapsed = num_seconds + " seconds ago";
      } else {
        timeElapsed = num_seconds + " second ago";
      }
    }
    return timeElapsed;
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
        text={post.text}
        time={calculateTime(post.createdAt)}
      />
    ));
  }

  return <div>{allPosts}</div>;
};

export default Home;
