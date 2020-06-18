import React, { useState } from "react";

const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [image, setImage] = useState("");
  const handleSubmit = () => {
    const data = new FormData();
    data.append("file", image);
  };
  return (
    <div>
      <input
        type="text"
        name="title"
        placeholder="Title"
        value={title}
        onChange={(e) => {
          setTitle(e.target.value);
        }}
      />
      <input
        type="text"
        name="body"
        placeholder="Descrition"
        value={body}
        onChange={(e) => {
          setBody(e.target.value);
        }}
      />
      <input
        type="file"
        name="image"
        placeholder="Descrition"
        value={image}
        onChange={(e) => {
          setImage(e.target.files[0]);
        }}
      />
      <button
        color="blue"
        onClick={() => {
          handleSubmit();
        }}
      >
        Submit
      </button>
    </div>
  );
};

export default CreatePost;
