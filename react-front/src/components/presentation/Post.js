import React from "react";

const Post = (props) => {
  const url = "/post/image/" + props.filename;
  const url2 =
    "https://instagram.fjai1-2.fna.fbcdn.net/v/t51.2885-19/s320x320/79967735_514903752444934_1105358873562185728_n.jpg?_nc_ht=instagram.fjai1-2.fna.fbcdn.net&_nc_ohc=tJTC28-_B6YAX9IxN5y&oh=d89568e3f4ed5c6389ac9ec8beea0729&oe=5F12AFDB";
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
          }}
        >
          <img
            src={url}
            style={{ width: "35px", height: "35px", borderRadius: "17px" }}
          />
          <h6>im.rajansingh</h6>
        </div>
        <img
          src={url}
          style={{ width: "35px", height: "35px", borderRadius: "17px" }}
        />
      </div>
      <img src={url} style={{ width: "100%" }} />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div style={{ display: "flex" }}>
          <h6>like</h6>
          <h6>comment</h6>
        </div>
        <h6>bookmark</h6>
      </div>
      <div>
        <h6>liked by rajansingh and 77 others</h6>
      </div>
      <div>
        <h6>view all 77 comments</h6>
        <h6>some of the popular comments</h6>
      </div>
      <div>
        <h6>time stamp</h6>
      </div>
      <div>
        <h6>add comment part</h6>
      </div>
    </div>
  );
};

export default Post;
